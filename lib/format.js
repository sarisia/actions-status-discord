"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const formatters = {
    push: pushFormatter,
    pull_request: pullRequestFormatter
};
function formatEvent(event, payload) {
    utils_1.logInfo(JSON.stringify(payload, null, 2));
    let msg = "No further information";
    if (event in formatters) {
        try {
            return formatters[event](payload) || msg;
        }
        catch (e) {
            utils_1.logInfo(`Failed to generate eventDetail for ${event}: ${e}\n${e.stack}`);
        }
    }
    return msg;
}
exports.formatEvent = formatEvent;
function pushFormatter(payload) {
    return `[\`${payload.head_commit.id.substring(0, 7)}\`](${payload.head_commit.url}) ${payload.head_commit.message}`;
}
function pullRequestFormatter(payload) {
    return `[\`#${payload.pull_request.number}\`](${payload.pull_request.html_url}) ${payload.pull_request.title}`;
}
