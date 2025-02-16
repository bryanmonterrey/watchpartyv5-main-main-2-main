// ingress.ts

"use server";

import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

// Initialize AWS SDK
AWS.config.update({ region: process.env.AWS_REGION });
const medialive = new AWS.MediaLive();
const ec2 = new AWS.EC2();
const sns = new AWS.SNS();
const ssm = new AWS.SSM();

const TOPIC_ARN = process.env.AWS_SNS_TOPIC_ARN || "arn:aws:sns:us-east-1:065779977513:StreamingAlarmTopic";
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || "stream.watchparty.xyz";

const encoderSettings: AWS.MediaLive.EncoderSettings = {
  AudioDescriptions: [
    {
      AudioSelectorName: 'Default',
      CodecSettings: {
        AacSettings: {
          InputType: 'NORMAL',
          Bitrate: 96000,
          CodingMode: 'CODING_MODE_2_0',
          RawFormat: 'NONE',
          Spec: 'MPEG4',
          Profile: 'LC',
          RateControlMode: 'CBR',
          SampleRate: 48000,
        },
      },
      LanguageCodeControl: 'FOLLOW_INPUT',
      Name: 'audio_1',
    },
  ],
  VideoDescriptions: [
    {
      CodecSettings: {
        H264Settings: {
          AdaptiveQuantization: 'HIGH',
          Bitrate: 5000000,
          ColorMetadata: 'INSERT',
          EntropyEncoding: 'CABAC',
          FlickerAq: 'ENABLED',
          FramerateControl: 'SPECIFIED',
          FramerateNumerator: 30,
          FramerateDenominator: 1,
          GopBReference: 'ENABLED',
          GopClosedCadence: 1,
          GopSize: 60,
          GopSizeUnits: 'FRAMES',
          Level: 'H264_LEVEL_AUTO',
          LookAheadRateControl: 'HIGH',
          NumRefFrames: 3,
          ParControl: 'INITIALIZE_FROM_SOURCE',
          Profile: 'HIGH',
          RateControlMode: 'CBR',
          SceneChangeDetect: 'ENABLED',
          SpatialAq: 'ENABLED',
          TemporalAq: 'ENABLED',
          TimecodeInsertion: 'DISABLED',
        },
      },
      Height: 1080,
      Name: 'video_1080p',
      RespondToAfd: 'NONE',
      ScalingBehavior: 'DEFAULT',
      Sharpness: 50,
      Width: 1920,
    },
  ],
  OutputGroups: [
    {
      Name: 'HLS',
      OutputGroupSettings: {
        HlsGroupSettings: {
          AdMarkers: [],
          CaptionLanguageSetting: 'OMIT',
          ClientCache: 'ENABLED',
          CodecSpecification: 'RFC_4281',
          Destination: {
            DestinationRefId: 'destination1'
          },
          DirectoryStructure: 'SINGLE_DIRECTORY',
          ManifestCompression: 'NONE',
          Mode: 'LIVE',
          OutputSelection: 'MANIFESTS_AND_SEGMENTS',
          ProgramDateTime: 'INCLUDE',
          SegmentLength: 6,
          StreamInfResolution: 'INCLUDE',
          TimedMetadataId3Period: 10,
        },
      },
      Outputs: [
        {
          AudioDescriptionNames: ['audio_1'],
          OutputName: 'output_1080p',
          VideoDescriptionName: 'video_1080p',
          OutputSettings: {
            HlsOutputSettings: {
              NameModifier: '_1080p',
              HlsSettings: {
                StandardHlsSettings: {
                  M3u8Settings: {
                    AudioFramesPerPes: 4,
                    AudioPids: '492-498',
                    EcmPid: '8182',
                    PcrControl: 'PCR_EVERY_PES_PACKET',
                    PmtPid: '480',
                    ProgramNum: 1,
                    Scte35Pid: '500',
                    Scte35Behavior: 'NO_PASSTHROUGH',
                    TimedMetadataPid: '502',
                    VideoPid: '481'
                  },
                  AudioRenditionSets: 'PROGRAM_AUDIO'
                }
              },
            },
          },
        },
      ],
    },
    {
      Name: 'Archive',
      OutputGroupSettings: {
        ArchiveGroupSettings: {
          Destination: {
            DestinationRefId: 's3-archive-destination'
          },
          RolloverInterval: 60,
        },
      },
      Outputs: [
        {
          AudioDescriptionNames: ['audio_1'],
          OutputName: 'archive_output',
          VideoDescriptionName: 'video_1080p',
          OutputSettings: {
            ArchiveOutputSettings: {
              NameModifier: '-archive',
              Extension: 'mp4',
              ContainerSettings: {
                M2tsSettings: {
                  AudioBufferModel: 'ATSC',
                  BufferModel: 'MULTIPLEX',
                  RateMode: 'CBR',
                  AudioPids: '492-498',
                  EcmPid: '8182',
                  EsRateInPes: 'EXCLUDE',
                  PcrControl: 'PCR_EVERY_PES_PACKET',
                  PmtPid: '480',
                  ProgramNum: 1,
                  Scte35Pid: '500',
                  Scte35Control: 'NONE',
                  TimedMetadataPid: '502',
                  VideoPid: '481'
                }
              },
            },
          },
        },
      ],
    },
  ],
  TimecodeConfig: {
    Source: 'EMBEDDED',
  },
};

export async function resetIngresses(hostIdentity: string) {
  console.log(`Resetting ingresses for host: ${hostIdentity}`);
  try {
    const channels = await medialive.listChannels({ MaxResults: 20 }).promise();
    const channelsToDelete = channels.Channels?.filter(channel => channel.Name?.includes(hostIdentity)) || [];

    for (const channel of channelsToDelete) {
      if (channel.State === 'RUNNING') {
        await medialive.stopChannel({ ChannelId: channel.Id! }).promise();
      }
      await medialive.deleteChannel({ ChannelId: channel.Id! }).promise();
    }

    console.log('Reset completed successfully');
  } catch (error) {
    console.error('Error in resetIngresses:', error);
    throw error;
  }
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getOrCreateSecurityGroup(): Promise<string> {
  try {
    console.log('Attempting to find existing MediaLive Input Security Group...');
    const { InputSecurityGroups } = await medialive.listInputSecurityGroups().promise();
    
    if (InputSecurityGroups && InputSecurityGroups.length > 0) {
      const existingGroupId = InputSecurityGroups[0].Id!;
      console.log('Existing MediaLive Input Security Group found:', existingGroupId);
      return existingGroupId;
    }

    console.log('Creating new MediaLive Input Security Group...');
    const { SecurityGroup } = await medialive.createInputSecurityGroup({
      WhitelistRules: [
        {
          Cidr: process.env.ALLOWED_IP_RANGE || '0.0.0.0/0'
        }
      ]
    }).promise();

    if (!SecurityGroup || !SecurityGroup.Id) {
      throw new Error('Failed to create MediaLive Input Security Group');
    }

    console.log('New MediaLive Input Security Group created:', SecurityGroup.Id);
    return SecurityGroup.Id;
  } catch (error) {
    console.error('Error getting or creating MediaLive Input Security Group:', error);
    throw error;
  }
}

export async function createIngress(): Promise<string> {
  console.log(`Creating ingress`);

  const MAX_RETRIES = 3;
  const INITIAL_BACKOFF = 2000;

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const self = await getSelf();
      console.log(`User: ${self.username}, ID: ${self.id}`);

      await resetIngresses(self.id);

      const securityGroupId = await getOrCreateSecurityGroup();
      console.log('Security Group ID:', securityGroupId);

      const streamKey = uuidv4().replace(/-/g, '').substring(0, 16);
      const customRtmpUrl = `rtmp://stream.watchparty.xyz/live`;

      const input = await medialive.createInput({
        Name: `input-${self.id}`,
        Type: 'RTMP_PUSH',
        InputSecurityGroups: [securityGroupId],
        Destinations: [{ StreamName: `${self.id}-${streamKey}` }]
      }).promise();

      console.log('Input created:', input);

      const destinationPassword = Math.random().toString(36).slice(-8);

      await ssm.putParameter({
        Name: `/medialive/destination-password-${self.id}`,
        Value: destinationPassword,
        Type: 'SecureString',
        Overwrite: true
      }).promise();

      const channel = await medialive.createChannel({
        ChannelClass: 'SINGLE_PIPELINE',
        Destinations: [
          {
            Id: 'media-package-output',
            Settings: [
              {
                Url: `https://${CLOUDFRONT_DOMAIN}/channel-output/${self.id}/${streamKey}/index.m3u8`,
                Username: 'destination-username',
                PasswordParam: `/medialive/destination-password-${self.id}`
              }
            ]
          },
          {
            Id: 's3-archive-output',
            Settings: [
              {
                Url: `s3://${process.env.VOD_BUCKET_NAME}/${self.id}/`
              }
            ]
          }
        ],
        EncoderSettings: {
          ...encoderSettings,
          OutputGroups: [
            {
              Name: 'HLS',
              OutputGroupSettings: {
                HlsGroupSettings: {
                  Destination: {
                    DestinationRefId: 'media-package-output'
                  },
                  HlsCdnSettings: {
                    HlsWebdavSettings: {
                      ConnectionRetryInterval: 1,
                      FilecacheDuration: 300,
                      HttpTransferMode: 'NON_CHUNKED',
                      NumRetries: 10,
                      RestartDelay: 15
                    }
                  }
                }
              },
              Outputs: [
                {
                  AudioDescriptionNames: ['audio_1'],
                  OutputName: 'output_1080p',
                  VideoDescriptionName: 'video_1080p',
                  OutputSettings: {
                    HlsOutputSettings: {
                      NameModifier: '_1080p',
                      HlsSettings: {
                        StandardHlsSettings: {
                          M3u8Settings: {
                            AudioFramesPerPes: 4,
                            AudioPids: '492-498',
                            EcmPid: '8182',
                            PcrControl: 'PCR_EVERY_PES_PACKET',
                            PmtPid: '480',
                            ProgramNum: 1,
                            Scte35Pid: '500',
                            Scte35Behavior: 'NO_PASSTHROUGH',
                            TimedMetadataPid: '502',
                            VideoPid: '481'
                          },
                          AudioRenditionSets: 'PROGRAM_AUDIO'
                        }
                      },
                    },
                  },
                },
              ]
            },
            {
              Name: 'Archive',
              OutputGroupSettings: {
                ArchiveGroupSettings: {
                  Destination: {
                    DestinationRefId: 's3-archive-output'
                  },
                  RolloverInterval: 60,
                },
              },
              Outputs: [
                {
                  AudioDescriptionNames: ['audio_1'],
                  OutputName: 'archive_output',
                  VideoDescriptionName: 'video_1080p',
                  OutputSettings: {
                    ArchiveOutputSettings: {
                      NameModifier: '-archive',
                      Extension: 'mp4',
                      ContainerSettings: {
                        M2tsSettings: {
                          AudioBufferModel: 'ATSC',
                          BufferModel: 'MULTIPLEX',
                          RateMode: 'CBR',
                          AudioPids: '492-498',
                          EcmPid: '8182',
                          EsRateInPes: 'EXCLUDE',
                          PcrControl: 'PCR_EVERY_PES_PACKET',
                          PmtPid: '480',
                          ProgramNum: 1,
                          Scte35Pid: '500',
                          Scte35Control: 'NONE',
                          TimedMetadataPid: '502',
                          VideoPid: '481'
                        }
                      },
                    },
                  },
                },
              ],
            }
          ]
        },
        InputAttachments: [
          {
            InputId: input.Input!.Id!,
            InputSettings: {
              SourceEndBehavior: 'CONTINUE'
            }
          }
        ],
        InputSpecification: {
          Codec: 'AVC',
          MaximumBitrate: 'MAX_20_MBPS',
          Resolution: 'HD'
        },
        Name: `channel-${self.id}`,
        RoleArn: process.env.MEDIA_LIVE_ROLE_ARN!,
      }).promise();

      console.log('Channel created:', channel);

      const updatedStream = await db.stream.update({
        where: { userId: self.id },
        data: {
          ingressId: channel.Channel!.Id,
          serverUrl: customRtmpUrl,
          streamKey: `${self.id}-${streamKey}`
        },
      });

      console.log('Stream updated in database:', updatedStream);

      await sns.publish({
        TopicArn: TOPIC_ARN,
        Message: JSON.stringify({
          type: 'STREAM_CREATED',
          streamId: updatedStream.id,
          ingressId: channel.Channel!.Id,
          channelId: channel.Channel!.Id,
        }),
      }).promise();

      console.log('SNS message published');

      revalidatePath(`/u/${self.username}/keys`);
      
      return JSON.stringify({
        ingressId: channel.Channel!.Id,
        serverUrl: customRtmpUrl,
        streamKey: `${self.id}-${streamKey}`,
        playbackUrl: `https://${CLOUDFRONT_DOMAIN}/out/${self.id}-${streamKey}/index.m3u8`
      });
    } catch (error: any) {
      console.error('Error in createIngress:', error);
      retries++;
      if (retries >= MAX_RETRIES) {
        console.log('Max retries reached. Giving up.');
        throw new Error('Failed to create ingress after max retries');
      }
      const backoff = INITIAL_BACKOFF * Math.pow(2, retries);
      console.log(`Error occurred. Retrying in ${backoff}ms...`);
      await wait(backoff);
    }
  }

  throw new Error('Failed to create ingress after max retries');
}
export async function startChannel(ingressId: string): Promise<void> {
  try {
    await medialive.startChannel({ ChannelId: ingressId }).promise();
    await waitForChannelState(ingressId, 'RUNNING');
    console.log(`Channel ${ingressId} started successfully`);
    
    await sns.publish({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify({
        type: 'CHANNEL_STARTED',
        channelId: ingressId,
      }),
    }).promise();
  } catch (error) {
    console.error(`Error starting channel ${ingressId}:`, error);
    throw error;
  }
}

export async function stopChannel(ingressId: string): Promise<void> {
  try {
    await medialive.stopChannel({ ChannelId: ingressId }).promise();
    await waitForChannelState(ingressId, 'IDLE');
    console.log(`Channel ${ingressId} stopped successfully`);

    await sns.publish({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify({
        type: 'CHANNEL_STOPPED',
        channelId: ingressId,
      }),
    }).promise();
  } catch (error) {
    console.error(`Error stopping channel ${ingressId}:`, error);
    throw error;
  }
}

async function waitForChannelState(channelId: string, targetState: string, maxAttempts = 30, delayMs = 10000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { State } = await medialive.describeChannel({ ChannelId: channelId }).promise();
    if (State === targetState) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  throw new Error(`Channel did not reach ${targetState} state within the expected time`);
}

export async function getIngressStatus(ingressId: string): Promise<string> {
  try {
    const { State } = await medialive.describeChannel({ ChannelId: ingressId }).promise();
    return State || 'UNKNOWN';
  } catch (error) {
    console.error(`Error getting status for ingress ${ingressId}:`, error);
    throw error;
  }
}

export async function listIngresses(userId: string): Promise<AWS.MediaLive.DescribeChannelResponse[]> {
  try {
    const channels = await medialive.listChannels().promise();
    const userChannels = channels.Channels?.filter(channel => channel.Name?.includes(userId)) || [];
    const channelDetails = await Promise.all(
      userChannels.map(channel => medialive.describeChannel({ ChannelId: channel.Id! }).promise())
    );
    return channelDetails;
  } catch (error) {
    console.error(`Error listing ingresses for user ${userId}:`, error);
    throw error;
  }
}

export async function handleInputStateChange(inputId: string, state: string): Promise<void> {
  console.log(`Input state changed. Input: ${inputId}, New State: ${state}`);
  try {
    const stream = await db.stream.findFirst({
      where: { ingressId: inputId },
    });

    if (!stream) {
      console.error(`No stream found for input ${inputId}`);
      return;
    }

    if (state === 'STREAMING' && !stream.isLive) {
      await startChannel(stream.ingressId!);
      await db.stream.update({
        where: { id: stream.id },
        data: { isLive: true },
      });
    } else if (state === 'IDLE' && stream.isLive) {
      await stopChannel(stream.ingressId!);
      await db.stream.update({
        where: { id: stream.id },
        data: { isLive: false },
      });
    }

    await sns.publish({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify({
        type: 'INPUT_STATE_CHANGED',
        streamId: stream.id,
        ingressId: inputId,
        newState: state,
      }),
    }).promise();
  } catch (error) {
    console.error('Error handling input state change:', error);
  }
}