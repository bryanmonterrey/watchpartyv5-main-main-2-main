const { MediaLiveClient, ListInputsCommand } = require("@aws-sdk/client-medialive");

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const request = event.Records[0].cf.request;
    console.log('Original request:', JSON.stringify(request, null, 2));

    // Extract stream key from the path
    const pathParts = request.uri.split('/').filter(Boolean);
    const streamKey = pathParts[pathParts.length - 1];
    console.log(`Extracted stream key: ${streamKey}`);

    if (!streamKey || !request.uri.startsWith('/live/')) {
        console.log('Not a streaming request, passing through');
        return request;
    }

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
                    domainName: 'stream.watchparty.xyz', // Use your DNS name here
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
    
    try {
        console.log('Fetching from MediaLive...');
        const inputs = await listMediaLiveInputs();
        console.log('MediaLive inputs:', JSON.stringify(inputs, null, 2));
        const input = inputs.find(input => input.Name.includes(streamKey));

        if (input) {
            console.log('MediaLive input found');
            return input;
        }
        console.log('MediaLive input not found');
    } catch (error) {
        console.error('Error fetching from MediaLive:', error);
    }

    console.log('No MediaLive input found, returning null');
    return null;
}

async function listMediaLiveInputs() {
    const client = new MediaLiveClient({ region: "us-east-1" });
    const command = new ListInputsCommand({});
    try {
        const response = await client.send(command);
        return response.Inputs;
    } catch (error) {
        console.error("Error listing MediaLive inputs:", error);
        throw error;
    }
}