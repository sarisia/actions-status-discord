"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const axios_1 = __importDefault(require("axios"));
const input_1 = require("./input");
const utils_1 = require("./utils");
const format_1 = require("./format");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inputs = input_1.getInputs();
            const payload = getPayload(inputs);
            yield Promise.all(inputs.webhooks.map(w => wrapWebhook(w.trim(), payload)));
        }
        catch (e) {
            utils_1.logError(e.message);
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
                    utils_1.logError(`${e.response.status}: ${JSON.stringify(e.response.data)}`);
                }
                else {
                    utils_1.logError(e);
                }
            }
        });
    }();
}
function getPayload(inputs) {
    const ctx = github.context;
    const { owner, repo } = ctx.repo;
    const { eventName, sha, ref, workflow, actor, payload } = ctx;
    const repoURL = `https://github.com/${owner}/${repo}`;
    const workflowURL = `${repoURL}/commit/${sha}/checks`;
    utils_1.logInfo(JSON.stringify(payload));
    const eventFieldTitle = `Event - ${eventName}`;
    const eventDetail = format_1.formatEvent(eventName, payload);
    let embed = {
        color: inputs.color || input_1.statusOpts[inputs.status].color,
        timestamp: (new Date()).toISOString()
    };
    if (inputs.job) {
        embed.title = inputs.job;
    }
    if (inputs.description) {
        embed.description = inputs.description;
    }
    if (!inputs.nodetail) {
        embed.title = input_1.statusOpts[inputs.status].status + (embed.title ? `: ${embed.title}` : '');
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
        embeds: [embed]
    };
    if (inputs.username) {
        discord_payload.username = inputs.username;
    }
    if (inputs.avatar_url) {
        discord_payload.avatar_url = inputs.avatar_url;
    }
    utils_1.logInfo(`embed: ${JSON.stringify(embed)}`);
    return discord_payload;
}
exports.getPayload = getPayload;
run();
