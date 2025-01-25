import * as core from '@actions/core'
import { logWarning, stob } from './utils'

export interface Inputs {
    webhooks: string[]
    status: string
    content: string
    description: string
    title: string
    image: string
    color?: number
    url: string
    username: string
    avatar_url: string
    nocontext: boolean
    noprefix: boolean
    notimestamp: boolean
    ack_no_webhook: boolean
}

interface StatusOption {
    status: string
    color: number
}

export const statusOpts: Record<string, StatusOption> = {
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

export function getInputs(): Inputs {
    // webhook
    const webhook: string = core.getInput('webhook').trim() || process.env.DISCORD_WEBHOOK || ''
    const webhooks: string[] = webhook.split('\n').filter(x => x || false)
    // prevent webhooks from leak
    webhooks.forEach((w, i) => {
        core.setSecret(w)
        // if webhook has `/github` suffix, warn them (do not auto-fix)
        if (w.endsWith('/github')) {
            logWarning(`webhook ${i + 1}/${webhooks.length} has \`/github\` suffix! This may cause errors.`)
        }
    })

    // nodetail -> nocontext, noprefix
    const nodetail = stob(core.getInput('nodetail'))
    const nocontext = nodetail || stob(core.getInput('nocontext'))
    const noprefix = nodetail || stob(core.getInput('noprefix'))

    const colorParsed = parseInt(core.getInput("color"))

    const inputs: Inputs = {
        webhooks: webhooks,
        status: core.getInput('status').trim().toLowerCase(),
        content: core.getInput('content').trim(),
        description: core.getInput('description').trim(),
        title: (core.getInput('job') || core.getInput('title')).trim(),
        image: core.getInput('image').trim(),
        color: isNaN(colorParsed) ? undefined : colorParsed,
        url: core.getInput('url').trim(),
        username: core.getInput('username').trim(),
        avatar_url: core.getInput('avatar_url').trim(),
        nocontext: nocontext,
        noprefix: noprefix,
        notimestamp: stob(core.getInput('notimestamp')),
        ack_no_webhook: stob(core.getInput('ack_no_webhook'))
    }

    // validate
    if (!inputs.webhooks.length && !inputs.ack_no_webhook) {
        throw new Error("No webhook is given. If this is intended, you can suppress this error by setting `ack_no_webhook` to `true`.")
    }
    if (!(inputs.status in statusOpts)) {
        throw new Error(`invalid status value: ${inputs.status}`)
    }

    return inputs
}
