const { constants } = require("./lib/constants");
const { buildServiceUnavailableError } = require("./lib/global-exception-handler");
const mainService = require("./services/main.service");
exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    if (constants.SERVICE_UNAVAILABLE === '1') {
        return buildServiceUnavailableError();
    }
    return mainService.doAction(event, context);
}