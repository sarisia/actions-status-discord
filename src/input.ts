import * as core from '@actions/core'

export interface Inputs {
    readonly nodetail: boolean
    readonly webhooks: string[]
    readonly status:string
    readonly description: string
    readonly job: string
    readonly color: number
    readonly username: string
    readonly avatar_url: string
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
    const webhook: string = core.getInput('nodetail').trim() || process.env.DISCORD_WEBHOOK || ''
    const inputs: Inputs =  {
        nodetail: core.getInput('nodetail').trim().toLowerCase() === 'true',
        webhooks: webhook.split('\n'),
        status: core.getInput('status').trim().toLowerCase(),
        description: core.getInput('description').trim(),
        job: core.getInput('job').trim(),
        color: parseInt(core.getInput('color')),
        username: core.getInput('username').trim(),
        avatar_url: core.getInput('avatar_url').trim()
    }

    // validate
    if (!inputs.webhooks.length) {
        throw new Error("no webhook is given")
    }
    if (!(status in statusOpts)) {
        throw new Error(`invalid status value: ${status}`)
    }

    return inputs
}
