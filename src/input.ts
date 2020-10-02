import * as core from '@actions/core'
import { logWarning, stob } from './utils'

export interface Inputs {
    readonly webhooks: string[]
    readonly status:string
    readonly description: string
    readonly title: string
    readonly color: number
    readonly username: string
    readonly avatar_url: string
    readonly nocontext: boolean
    readonly noprefix: boolean
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
            logWarning(`webhook ${i+1}/${webhooks.length} has \`/github\` suffix! This may cause errors.`)
        }
    })

    // nodetail -> nocontext, noprefix
    const nodetail = stob(core.getInput('nodetail'))
    const nocontext = nodetail || stob(core.getInput('nocontext'))
    const noprefix = nodetail || stob(core.getInput('noprefix'))

    const inputs: Inputs =  {
        webhooks: webhooks,
        status: core.getInput('status').trim().toLowerCase(),
        description: core.getInput('description').trim(),
        title: (core.getInput('title') || core.getInput('job')).trim(),
        color: parseInt(core.getInput('color')),
        username: core.getInput('username').trim(),
        avatar_url: core.getInput('avatar_url').trim(),
        nocontext: nocontext,
        noprefix: noprefix
    }

    // validate
    if (!inputs.webhooks.length) {
        throw new Error("no webhook is given")
    }
    if (!(inputs.status in statusOpts)) {
        throw new Error(`invalid status value: ${inputs.status}`)
    }

    return inputs
}
