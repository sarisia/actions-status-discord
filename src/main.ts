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
    const webhook: string = core.getInput('webhook') || process.env.DISCORD_WEBHOOK || ''
    if (!webhook) {
        logError('No webhook endpoint is given', nofail)
        process.exit()
    }
    const status: string = core.getInput('status').toLowerCase()
    if (!(status in statusOpts)) {
        logError('Invalid status value', nofail)
        process.exit()
    }
    const description: string = core.getInput('description')
    const job: string = core.getInput('job')

    try {
        await axios.post(webhook, getPayload(status, description, job))
    } catch (e) {
        logError(e, nofail)
    }
}

function logError(msg: string, nofail: boolean): void {
    nofail ? core.error(msg) : core.setFailed(msg)
}

function getPayload(status: string, description: string, job: string): object {
    const ctx = github.context
    const { owner, repo } = ctx.repo
    const { eventName, sha, ref, workflow, actor } = ctx
    const repoURL = `https://github.com/${owner}/${repo}`
    const workflowURL = `${repoURL}/commit/${sha}/checks`

    let payload = {
        embeds: [{
            title: statusOpts[status].status + (job ? `: ${job}` : ''),
            color: statusOpts[status].color,
            description: description || null,
            timestamp: (new Date()).toISOString(),
            fields: [
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
                    name: 'Event',
                    value: eventName,
                    inline: true
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
        }]
    }

    core.debug(`payload: ${JSON.stringify(payload)}`)
    return payload
}

run()
