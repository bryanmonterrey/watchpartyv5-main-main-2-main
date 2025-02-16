const AWS = require('aws-sdk');
const medialive = new AWS.MediaLive({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const request = event.Records[0].cf.request;
    console.log('Original request:', JSON.stringify(request, null, 2));

    // Extract stream key from the path
    const streamKey = request.uri.split('/').filter(Boolean).pop();
    console.log(`Extracted stream key: ${streamKey}`);

    try {
        console.log('Fetching MediaLive input...');
        const mediaLiveInput = await fetchMediaLiveInput(streamKey);
        console.log('MediaLive input result:', JSON.stringify(mediaLiveInput, null, 2));

        if (mediaLiveInput && mediaLiveInput.Destinations && mediaLiveInput.Destinations.length > 0) {
            console.log(`Found MediaLive input for stream key: ${streamKey}`);
            const destinationUrl = new URL(mediaLiveInput.Destinations[0].Url);
            console.log('Destination URL:', destinationUrl.toString());
            
            request.origin = {
                custom: {
                    domainName: destinationUrl.hostname,
                    port: 1935,
                    protocol: 'rtmp',
                    path: destinationUrl.pathname,
                    sslProtocols: ['TLSv1.2'],
                    readTimeout: 30,
                    keepaliveTimeout: 5,
                    customHeaders: {}
                }
            };
            request.uri = `/${streamKey}`;
            console.log('Updated request:', JSON.stringify(request, null, 2));
        } else {
            console.log(`No MediaLive input found for stream key: ${streamKey}`);
            return {
                status: '404',
                statusDescription: 'Not Found',
                body: 'Stream not found'
            };
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            status: '500',
            statusDescription: 'Internal Server Error',
            body: 'Error processing request'
        };
    }

    console.log('Returning final request:', JSON.stringify(request, null, 2));
    return request;
};

async function fetchMediaLiveInput(streamKey) {
    console.log(`Fetching MediaLive input for stream key: ${streamKey}`);
    
    // First, try to fetch from DynamoDB
    const params = {
        TableName: 'StreamKeys',
        Key: { streamKey: streamKey }
    };

    try {
        console.log('Attempting to fetch from DynamoDB...');
        const result = await dynamodb.get(params).promise();
        if (result.Item) {
            console.log('MediaLive input found in DynamoDB cache');
            return result.Item.mediaLiveInput;
        }
        console.log('MediaLive input not found in DynamoDB cache');
    } catch (error) {
        console.error('Error fetching from DynamoDB:', error);
    }

    // If not found in DynamoDB, fetch from MediaLive
    try {
        console.log('Fetching from MediaLive...');
        const inputs = await medialive.listInputs().promise();
        console.log('MediaLive inputs:', JSON.stringify(inputs, null, 2));
        const input = inputs.Inputs.find(input => input.Name.includes(streamKey));

        if (input) {
            console.log('MediaLive input found and caching in DynamoDB');
            await dynamodb.put({
                TableName: 'StreamKeys',
                Item: {
                    streamKey: streamKey,
                    mediaLiveInput: input
                }
            }).promise();
            return input;
        }
        console.log('MediaLive input not found');
    } catch (error) {
        console.error('Error fetching from MediaLive:', error);
    }

    console.log('No MediaLive input found, returning null');
    return null;
}