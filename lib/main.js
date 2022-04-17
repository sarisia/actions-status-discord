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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayload = void 0;
const core_1 = require("@actions/core");
const github = __importStar(require("@actions/github"));
const axios_1 = __importDefault(require("axios"));
const format_1 = require("./format");
const input_1 = require("./input");
const utils_1 = require("./utils");
const validate_1 = require("./validate");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, utils_1.logInfo)('Getting inputs...');
            const inputs = (0, input_1.getInputs)();
            (0, utils_1.logInfo)('Generating payload...');
            const payload = getPayload(inputs);
            (0, core_1.startGroup)('Dump payload');
            (0, utils_1.logInfo)(JSON.stringify(payload, null, 2));
            (0, core_1.endGroup)();
            (0, utils_1.logInfo)(`Triggering ${inputs.webhooks.length} webhook${inputs.webhooks.length > 1 ? 's' : ''}...`);
            yield Promise.all(inputs.webhooks.map(w => wrapWebhook(w.trim(), payload)));
        }
        catch (e) {
            (0, utils_1.logError)(`Unexpected failure: ${e} (${e.message})`);
        }
    });
}
function wrapWebhook(webhook, payload) {
    return function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(webhook, payload);
            }
            catch (e) {
                if (e.response) {
                    (0, utils_1.logError)(`Webhook response: ${e.response.status}: ${JSON.stringify(e.response.data)}`);
                }
                else {
                    (0, utils_1.logError)(e);
                }
            }
        });
    }();
}
function getPayload(inputs) {
    var _a, _b;
    const ctx = github.context;
    const { owner, repo } = ctx.repo;
    const { eventName, sha, ref, workflow, actor, payload } = ctx;
    const repoURL = `https://github.com/${owner}/${repo}`;
    const validSHA = ((_b = (_a = ctx.payload.pull_request) === null || _a === void 0 ? void 0 : _a.head) === null || _b === void 0 ? void 0 : _b.sha) || sha;
    const workflowURL = `${repoURL}/commit/${validSHA}/checks`;
    (0, utils_1.logDebug)(JSON.stringify(payload));
    const eventFieldTitle = `Event - ${eventName}`;
    const eventDetail = (0, format_1.formatEvent)(eventName, payload);
    let embed = {
        color: inputs.color || input_1.statusOpts[inputs.status].color
    };
    if (!inputs.notimestamp) {
        embed.timestamp = (new Date()).toISOString();
    }
    if (inputs.title) {
        embed.title = inputs.title;
    }
    if (inputs.url) {
        embed.url = inputs.url;
    }
    if (inputs.image) {
        embed.image = {
            url: inputs.image
        };
    }
    if (!inputs.noprefix) {
        embed.title = input_1.statusOpts[inputs.status].status + (embed.title ? `: ${embed.title}` : '');
    }
    if (inputs.description) {
        embed.description = inputs.description;
    }
    if (!inputs.nocontext) {
        embed.fields = [
            {
                name: 'Repository',
                value: `[${owner}/${repo}](${repoURL})`,
                inline: true
            },
            {
                name: 'Ref',
                value: ref,
                inline: true
            },
            {
                name: eventFieldTitle,
                value: eventDetail,
                inline: false
            },
            {
                name: 'Triggered by',
                value: actor,
                inline: true
            },
            {
                name: 'Workflow',
                value: `[${workflow}](${workflowURL})`,
                inline: true
            }
        ];
    }
    let discord_payload = {
        embeds: [(0, validate_1.fitEmbed)(embed)]
    };
    (0, utils_1.logDebug)(`embed: ${JSON.stringify(embed)}`);
    if (inputs.username) {
        discord_payload.username = inputs.username;
    }
    if (inputs.avatar_url) {
        discord_payload.avatar_url = inputs.avatar_url;
    }
    return discord_payload;
}
exports.getPayload = getPayload;
run();
