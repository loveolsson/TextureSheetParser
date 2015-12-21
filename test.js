var fs = require('fs');
var kv3 = require('./index.js');



var path = (process.argv[2]) ? process.argv[2]:'test/fire_particle_10_low.png.sheet';

var buffer = fs.readFileSync(path);
console.log(JSON.stringify(kv3.parse(buffer), null, "\t"));
