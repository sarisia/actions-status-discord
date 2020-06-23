"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = exports.statusOpts = void 0;
const core = __importStar(require("@actions/core"));
exports.statusOpts = {
    success: {
        status: 'Success',
        color: 0x28A745
    },
    failure: {
        status: 'Failure',
        color: 0xCB2431
    },
    cancelled: {
        status: 'Cancelled',
        color: 0xDBAB09
    }
};
function getInputs() {
    const webhook = core.getInput('webhook').trim() || process.env.DISCORD_WEBHOOK || '';
    const webhooks = webhook.split('\n').filter(x => x || false);
    webhooks.forEach(w => core.setSecret(w));
    const inputs = {
        nodetail: core.getInput('nodetail').trim().toLowerCase() === 'true',
        webhooks: webhooks,
        status: core.getInput('status').trim().toLowerCase(),
        description: core.getInput('description').trim(),
        title: (core.getInput('title') || core.getInput('job')).trim(),
        color: parseInt(core.getInput('color')),
        username: core.getInput('username').trim(),
        avatar_url: core.getInput('avatar_url').trim()
    };
    if (!inputs.webhooks.length) {
        throw new Error("no webhook is given");
    }
    if (!(inputs.status in exports.statusOpts)) {
        throw new Error(`invalid status value: ${inputs.status}`);
    }
    return inputs;
}
exports.getInputs = getInputs;
