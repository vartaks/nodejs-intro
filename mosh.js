
console.log("----------------- INFO ABOUT global object -------------------------");
console.log(global);

console.log("----------------- INFO ABOUT module object -------------------------");
console.log(module);

const path = require('path');

var pathObj = path.parse(__filename);

console.log("----------------- INFO ABOUT __filename path object -------------------------");
console.log(pathObj);

