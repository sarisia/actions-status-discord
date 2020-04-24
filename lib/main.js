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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const axios_1 = __importDefault(require("axios"));
const statusOpts = {
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const nofail = core.getInput('nofail').trim().toLowerCase() == 'true';
        const nodetail = core.getInput('nodetail').trim().toLowerCase() == 'true';
        const webhook = core.getInput('webhook') || process.env.DISCORD_WEBHOOK || '';
        if (!webhook) {
            logError('No webhook endpoint is given', nofail);
            process.exit();
        }
        const status = core.getInput('status').toLowerCase();
        if (!(status in statusOpts)) {
            logError('Invalid status value', nofail);
            process.exit();
        }
        const description = core.getInput('description');
        const job = core.getInput('job');
        const color = parseInt(core.getInput('color'));
        const username = core.getInput('username');
        const avatar_url = core.getInput('avatar_url');
        try {
            yield axios_1.default.post(webhook, getPayload(status, description, job, color, username, avatar_url, nodetail));
        }
        catch (e) {
            logError(e, nofail);
        }
    });
}
function logError(msg, nofail) {
    nofail ? core.error(msg) : core.setFailed(msg);
}
function getPayload(status, description, job, color, username, avatar_url, nodetail) {
    const ctx = github.context;
    const { owner, repo } = ctx.repo;
    const { eventName, sha, ref, workflow, actor, payload } = ctx;
    const repoURL = `https://github.com/${owner}/${repo}`;
    const workflowURL = `${repoURL}/commit/${sha}/checks`;
    core.debug(JSON.stringify(payload));
    // make event detail field from payload
    // TODO: move to separated file when this gets bigger
    const eventFieldTitle = `Event - ${eventName}`;
    let eventDetail = "No information to show";
    try {
        switch (eventName) {
            case "push":
                if (payload.head_commit) {
                    eventDetail = `[\`${payload.head_commit.id.substring(0, 7)}\`](${payload.head_commit.url}) ${payload.head_commit.message}`;
                }
                else {
                    eventDetail = `SHA: \`${sha.substring(0, 7)}\``;
                }
                break;
            case "pull_request":
                if (payload.pull_request) {
                    eventDetail = `[\`#${payload.pull_request.number}\`](${payload.pull_request.html_url}) ${payload.pull_request.title}`;
                }
                break;
        }
    }
    catch (error) {
        core.debug(`Failed to generate eventDetail: ${error}\n${error.stack}`);
    }
    let embed = {
        title: statusOpts[status].status + (job ? `: ${job}` : ''),
        color: color || statusOpts[status].color,
        timestamp: (new Date()).toISOString()
    };
    if (description) {
        embed.description = description;
    }
    if (!nodetail) {
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
    if (username) {
        discord_payload.username = username;
    }
    if (avatar_url) {
        discord_payload.avatar_url = avatar_url;
    }
    core.debug(`embed: ${JSON.stringify(embed)}`);
    return discord_payload;
}
run();
