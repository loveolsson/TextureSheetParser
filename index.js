module.exports.parse = function (buf) {
    var sequenceCount = buf.readUInt32LE(4);
    console.log("count", sequenceCount);

    var headers = [];

    for (var i = 0; i < sequenceCount; i++) {
        headers.push(parseHeader(buf, i * 32 + 8));
    }


    return headers;
}

function parseHeader(buf, offset) {
    var index = buf.readUInt32LE(offset + 0);
    var offset1 = buf.readUInt32LE(offset + 8) + offset + 8 + 4;
    var offset2 = buf.readUInt32LE(offset + 20) + offset + 20 + 4;
    var type = buf.readUInt32LE(offset + 12);

    var str = buf.toString('ascii', offset2, offset2 + 13);
    if (str != 'SheetSequence') return false;

    if (type == 1) { //Single frame
        var coords = [[], []];

        for (var i = 0; i < 8; i++) {
            var c = (i < 4) ? 0:1;
            coords[c].push(buf.readFloatLE(offset1 + 8 + i * 4));
        }


        return {index, type: 'single', str, frames: [coords]};
    }

    console.log('Unknown slice format', type);
    return null;
}
