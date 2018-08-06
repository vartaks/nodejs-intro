var os = require("os");

var scale = function (number, factor, decimalPlaces) {
    return (number / factor).toFixed(decimalPlaces);
}

// Default Temporary directory
console.log('temp dir : ' + os.tmpdir());

// Endianness
console.log('endianness : ' + os.endianness());

// OS Host name
console.log('hostname : ' + os.hostname());

// OS type
console.log('type : ' + os.type());

// OS platform
console.log('platform : ' + os.platform());

// OS CPU architecture
console.log('arch : ' + os.arch());

// OS Release
console.log('release : ' + os.release());

// OS uptime
console.log('uptime : ' + scale(os.uptime(), 3600*24, 2) + ' days.');

// Total system memory
console.log('total memory : ' + scale(os.totalmem(), 1024*1024, 2) + " MB.");

// Total free memory
console.log('free memory : ' + scale(os.freemem(), 1024*1024, 2) + " MB.");

// OS CPUs
console.log('CPUs : ' + JSON.stringify(os.cpus(), null, 2));

// OS network interfaces
console.log('Network interfaces : ' + JSON.stringify(os.networkInterfaces(), null, 2));

// OS End-of-line marker
console.log('EOL : ' + os.EOL);


