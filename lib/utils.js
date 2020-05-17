"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const NOFAIL = core.getInput('nofail').trim().toLowerCase() === 'true';
function logError(msg) {
    NOFAIL ? core.error(msg) : core.setFailed(msg);
}
exports.logError = logError;
function logInfo(msg) {
    core.debug(msg);
}
exports.logInfo = logInfo;
