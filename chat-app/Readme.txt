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
