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
        job: core.getInput('job').trim(),
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
