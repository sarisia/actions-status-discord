"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = exports.statusOpts = void 0;
const core = __importStar(require("@actions/core"));
const utils_1 = require("./utils");
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
    webhooks.forEach((w, i) => {
        core.setSecret(w);
        if (w.endsWith('/github')) {
            (0, utils_1.logWarning)(`webhook ${i + 1}/${webhooks.length} has \`/github\` suffix! This may cause errors.`);
        }
    });
    const nodetail = (0, utils_1.stob)(core.getInput('nodetail'));
    const nocontext = nodetail || (0, utils_1.stob)(core.getInput('nocontext'));
    const noprefix = nodetail || (0, utils_1.stob)(core.getInput('noprefix'));
    const inputs = {
        webhooks: webhooks,
        status: core.getInput('status').trim().toLowerCase(),
        description: core.getInput('description').trim(),
        title: (core.getInput('title') || core.getInput('job')).trim(),
        image: core.getInput('image').trim(),
        color: parseInt(core.getInput('color')),
        url: core.getInput('url').trim(),
        username: core.getInput('username').trim(),
        avatar_url: core.getInput('avatar_url').trim(),
        nocontext: nocontext,
        noprefix: noprefix,
        notimestamp: (0, utils_1.stob)(core.getInput('notimestamp'))
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
