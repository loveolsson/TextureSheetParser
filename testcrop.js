var fs = require('fs');
var kv3 = require('./index.js');
var easyimg = require('easyimage');


var path = (process.argv[2]) ? process.argv[2]:'test/fire_particle_10_low.png';

var buffer = fs.readFileSync(path + '.sheet');
var res = kv3.parse(buffer);
//console.log(JSON.stringify(res, null, "\t"));

easyimg.info(path).then(
    function(features){
        for (var i in res) {
            for (var frame in res[i].frames) {
                var opfile = path + "_" + i + "_" + frame + ".png";
                crop(opfile, res[i].frames[frame], features)

            }

        }
    },
    function (err) {
        console.log(err);
    });



    function crop(opfile, coords, features) {
        var x1 = Math.round(coords[1][0] * features.width);
        var y1 = Math.round(coords[1][1] * features.height);
        var x2 = Math.round(coords[1][2] * features.width);
        var y2 = Math.round(coords[1][3] * features.height);



        console.log(x1, y1, x2, y2);

        easyimg.crop({
            src:path, dst: opfile,
            cropwidth:x2-x1, cropheight:y2-y1,
            gravity:'NorthWest',
            x:x1, y:y1
        })
    }
