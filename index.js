module.exports.parse = function (buf) {
    var version = buf.readUInt32LE(0); //Maybe, could be? Don't care.
    var sequenceCount = buf.readUInt32LE(4);

    var headers = [];

    for (var i = 0; i < sequenceCount; i++) {
        headers.push(parseSequence(buf, i * 32 + 8));
    }


    return headers;
}

function parseSequence(buf, offset) {
    var index = buf.readUInt32LE(offset + 0);
    var offsetFramePointer = buf.readUInt32LE(offset + 8) + offset + 8 + 4;
    var fps = buf.readFloatLE(offset + 16); //Maybe, could be. Is always a float with the same value as no. of frames
    var offsetIdentifier = buf.readUInt32LE(offset + 20) + offset + 20 + 4;
    var frameCount = buf.readUInt32LE(offset + 12);

    var str = buf.toString('ascii', offsetIdentifier, offsetIdentifier + 13);
    if (str != 'SheetSequence') return false;

    var frames = [];

    for (var i = 0; i < frameCount; i ++) {
        var offsetCoords = buf.readUInt32LE(offsetFramePointer) + offsetFramePointer;

        frames.push(getCoords(buf, offsetCoords));
        offsetFramePointer += 12;
    }



    return {index, frameCount, fps, str, frames};

}

function getCoords(buf, offset) {
    var coords = [[], []];

    for (var i = 0; i < 8; i++) {
        var c = (i < 4) ? 0:1;
        coords[c].push(buf.readFloatLE(offset + i * 4, true));
    }


    return coords;
}
