A combined example that demonstrates the use of several asynchronous patterns in Node.js.
We'll simulate reading a file asynchronously, emitting events, and handling a stream of transformed data using an async iterator.

What it demonstrates:
* fs.promises.readFile – a Promise-based async file read.
* EventEmitter – emits start and end events.
* async generator function (lineStreamer) – yields data asynchronously.
* for await...of – used to consume an async stream.
* Error handling using try...catch.

To test it, create a simple sample.txt file in the same directory with some text lines.
