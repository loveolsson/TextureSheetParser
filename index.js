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
    var offsetIdentifier = buf.readUInt32LE(offset + 8) + offset + 8 + 4;
    var offsetFramePointer = buf.readUInt32LE(offset + 20) + offset + 20 + 4;
    var frameCount = buf.readUInt32LE(offset + 12);

    var str = buf.toString('ascii', offsetFramePointer, offsetFramePointer + 13);
    if (str != 'SheetSequence') return false;

    var frames = [];


    for (var i = 0; i < frameCount; i ++) {
        var offsetCoords = buf.readUInt32LE(offsetIdentifier) + offsetIdentifier;

        frames.push(getCoords(buf, offsetCoords));
        offsetIdentifier += 12;
    }



    return {index, frameCount, str, frames};

}

function getCoords(buf, offset) {
    var coords = [[], []];

    for (var i = 0; i < 8; i++) {
        var c = (i < 4) ? 0:1;
        coords[c].push(buf.readFloatLE(offset + i * 4, true));
    }


    return coords;
}
