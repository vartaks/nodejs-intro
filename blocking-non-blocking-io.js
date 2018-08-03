// Blocking IO example

console.log("Blocking IO example...");

var fs = require("fs");

var data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log("Program Ended\n");

// Non-blocking IO example

console.log("Non-blocking IO example...");

var fs = require("fs");

fs.readFile('input.txt', function (err, data) {
   if (err) return console.error(err);
   console.log(data.toString());
});

console.log("Program Ended\n");

