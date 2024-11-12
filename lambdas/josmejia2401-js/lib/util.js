function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRowId() {
    const shardId = randomIntFromInterval(1, 1000);
    const customerEoch = Date.now();
    let ts = new Date().getTime() - customerEoch;
    ts = (ts * 64);
    ts = ts + shardId;
    return parseInt((ts * 512) + Math.floor(Math.random() * 512));
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
