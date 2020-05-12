import * as core from '@actions/core'
import * as github from '@actions/github'
import axios from 'axios'

interface StatusOption {
    status: string
    color: number
}

const statusOpts: Record<string, StatusOption> = {
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
}

async function run() {
    const nofail: boolean = core.getInput('nofail').trim().toLowerCase() == 'true'
    const nodetail: boolean = core.getInput('nodetail').trim().toLowerCase() == 'true'
    const webhook: string = core.getInput('webhook') || process.env.DISCORD_WEBHOOK || ''
    const webhooks: string[] = webhook.trim().split("\n")
    if (!webhooks.length) {
        logError('No webhook endpoint is given', nofail)
        process.exit()
    }
    // set each webhook endpoint as secret to avoid accidentaly leak
    webhooks.forEach(w => core.setSecret(w))

    const status: string = core.getInput('status').toLowerCase()
    if (!(status in statusOpts)) {
        logError('Invalid status value', nofail)
        process.exit()
    }
    const description: string = core.getInput('description')
    const job: string = core.getInput('job')
    const color: number = parseInt(core.getInput('color'))
    const username: string = core.getInput('username')
    const avatar_url: string = core.getInput('avatar_url')

    const payload = getPayload(status, description, job, color, username, avatar_url, nodetail)
    await Promise.all(webhooks.map(w => wrapWebhook(w.trim(), payload, nofail)))
}

function wrapWebhook(webhook: string, payload: Object, nofail: boolean): Promise<void> {
    return async function() {
        try {
            await axios.post(webhook, payload)
        } catch(e) {
            if (e.response) {
                logError(`${e.response.status}: ${JSON.stringify(e.response.data)}`, nofail)
            } else {
                logError(e, nofail)
            }
        }
    }()
}

function logError(msg: string, nofail: boolean): void {
    nofail ? core.error(msg) : core.setFailed(msg)
}

function getPayload(
    status: string,
    description: string,
    job: string,
    color: number,
    username: string,
    avatar_url: string,
    nodetail: boolean
): Object {
    const ctx = github.context
    const { owner, repo } = ctx.repo
    const { eventName, sha, ref, workflow, actor, payload } = ctx
    const repoURL = `https://github.com/${owner}/${repo}`
    const workflowURL = `${repoURL}/commit/${sha}/checks`
    
    core.debug(JSON.stringify(payload))

    // make event detail field from payload
    // TODO: move to separated file when this gets bigger
    const eventFieldTitle = `Event - ${eventName}`
    let eventDetail = "No information to show"
    try {
        switch (eventName) {
            case "push":
                if (payload.head_commit) {
                    eventDetail = `[\`${payload.head_commit.id.substring(0, 7)}\`](${payload.head_commit.url}) ${payload.head_commit.message}`
                } else {
                    eventDetail = `SHA: \`${sha.substring(0, 7)}\``
                }
                break
            case "pull_request":
                if (payload.pull_request) {
                    eventDetail = `[\`#${payload.pull_request.number}\`](${payload.pull_request.html_url}) ${payload.pull_request.title}`
                }
                break
        }
    } catch (error) {
        core.debug(`Failed to generate eventDetail: ${error}\n${error.stack}`)
    }
    
    let embed: {[key: string]: any} = {
        color: color || statusOpts[status].color,
        timestamp: (new Date()).toISOString()
    }
    if (job) {
        embed.title = job
    }
    if (description) {
        embed.description = description
    }
    if (!nodetail) {
        embed.title = statusOpts[status].status + (embed.title ? `: ${embed.title}` : '')
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
        ]
    }

    let discord_payload: any = {
        embeds: [embed]
    }
    if (username) {
        discord_payload.username = username
    }
    if (avatar_url) {
        discord_payload.avatar_url = avatar_url
    }

    core.debug(`embed: ${JSON.stringify(embed)}`)
    return discord_payload
}

run()
