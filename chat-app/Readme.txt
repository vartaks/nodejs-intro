A combined example that demonstrates the use of several asynchronous patterns in Node.js.
We'll simulate reading a file asynchronously, emitting events, and handling a stream of transformed data using an async iterator.

What it demonstrates:
* fs.promises.readFile – a Promise-based async file read.
* EventEmitter – emits start and end events.
* async generator function (lineStreamer) – yields data asynchronously.
* for await...of – used to consume an async stream.
* Error handling using try...catch.

To test it, create a simple sample.txt file in the same directory with some text lines.
---------------------------------------------------------------------------------------------

Let’s add RxJS Observables into the mix. 
This version will:
* Read a file asynchronously (fs.promises)
* Emit start/end events with EventEmitter
* Stream each line as an RxJS Observable
* Transform the stream (e.g., to uppercase)
* Handle errors and completion

What’s New in This Version:
RxJS's from(): turns an array of lines into an observable stream.
concatMap() + delay(): adds artificial async behavior.
map(): transforms each line.
catchError(): handles stream-level errors.
subscribe(): defines how to react to each item, errors, and completion.
---------------------------------------------------------------------------------------------

Let’s extend the example to handle real-time data using sockets in Node.js, 
and process it with RxJS Observables for transformation and control.

Scenario:
* We'll set up a TCP server using Node's net module.
* Clients can connect and send data.
* Data from clients will be streamed as observables.
* Each message will be transformed (e.g., to uppercase) and logged.

How to test it:
1. Run the server (node server.js).
2. Connect using netcat or telnet:
"nc localhost 3000" OR "telnet localhost 3000"
3. Type messages — you'll see them processed and echoed back in uppercase.

Why RxJS here?
* fromEvent() cleanly converts socket events to an observable stream.
* map() and mergeMap() make it easy to transform and delay responses.
* catchError() ensures graceful error handling per stream.
---------------------------------------------------------------------------------------------

Here's a RxJS-powered TCP chat server in Node.js that:
* Accepts multiple client connections
* Uses RxJS to handle and transform messages
* Broadcasts messages to all connected clients (except the sender)
* Gracefully handles disconnects and errors

How to Use It:
1. Run the server:
node chat-server.js
2. Open multiple terminals and connect using telnet:
telnet localhost 3000
3. Type a message in one terminal — it broadcasts to others.
4. Type exit to disconnect a client.

Key Features:
* Uses fromEvent to turn socket events into observable streams.
* Uses mergeMap + map to transform message content.
* Set stores connected clients for broadcast.
* Gracefully handles disconnects and errors.
