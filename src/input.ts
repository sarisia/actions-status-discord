import * as core from '@actions/core'

export interface Inputs {
    readonly nodetail: boolean
    readonly webhooks: string[]
    readonly status:string
    readonly description: string
    readonly title: string
    readonly color: number
    readonly username: string
    readonly avatar_url: string
}

interface StatusOption {
    status: string
    color: number
    avatar_url: string
}

export const statusOpts: Record<string, StatusOption> = {
    success: {
        status: 'Success',
        color: 0x28A745,
        avatar_url: "https://cdn.discordapp.com/attachments/408617266197037058/740894482433703946/success.png"
    },
    failure: {
        status: 'Failure',
        color: 0xCB2431,
        avatar_url: "https://cdn.discordapp.com/attachments/408617266197037058/740894501173854208/failure.png"
    },
    cancelled: {
        status: 'Cancelled',
        color: 0xDBAB09,
        avatar_url: "https://cdn.discordapp.com/attachments/408617266197037058/740894521121833010/cancelled.png"
    }
}

export function getInputs(): Inputs {
    const webhook: string = core.getInput('webhook').trim() || process.env.DISCORD_WEBHOOK || ''
    const webhooks: string[] = webhook.split('\n').filter(x => x || false)
    // prevent webhooks from leak
    webhooks.forEach(w => core.setSecret(w))

    const inputs: Inputs =  {
        nodetail: core.getInput('nodetail').trim().toLowerCase() === 'true',
        webhooks: webhooks,
        status: core.getInput('status').trim().toLowerCase(),
        description: core.getInput('description').trim(),
        title: (core.getInput('title') || core.getInput('job')).trim(),
        color: parseInt(core.getInput('color')),
        username: core.getInput('username').trim(),
        avatar_url: core.getInput('avatar_url').trim()
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
