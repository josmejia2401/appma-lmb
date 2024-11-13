function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRowId() {
    const shardId = randomIntFromInterval(1, 10_000);
    //Date 1970-01-01T00:00:00.000Z
    let ts = Date.now() - new Date(null).getTime();
    ts = (ts * 67);
    ts = ts + shardId;
    return parseInt(ts);
}

exports.buildUuid = function () {
    return `${generateRowId()}`;
}

exports.getTraceID = function (headers) {
    return headers["x-amzn-trace-id"] || headers["X-Amzn-Trace-Id"] || "unset";
}

exports.getAuthorization = function (event) {
    return event.headers?.Authorization || event.headers?.authorization || event.authorizationToken;
}
