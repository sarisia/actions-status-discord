import { logInfo } from "./utils"

type Formatter = (payload: any) => string

const formatters: Record<string, Formatter> = {
    push: pushFormatter,
    pull_request: pullRequestFormatter
}

export function formatEvent(event: string, payload: Object, sha: string): string {
    logInfo(JSON.stringify(payload, null, 2))
    let msg: string = `SHA \`${sha}\``
    if (event in formatters) {
        try {
            const fmtmsg = formatters[event](payload)
            if (fmtmsg) {
                msg += ("\n" + fmtmsg)
            }
        } catch(e) {
            logInfo(`Failed to generate eventDetail: ${e}\n${e.stack}`)
        }
    }

    return msg
}

function pushFormatter(payload: any): string {
    return `[\`${payload.head_commit.id.substring(0, 7)}\`](${payload.head_commit.url}) ${payload.head_commit.message}`
}

function pullRequestFormatter(payload: any): string {
    return `[\`#${payload.pull_request.number}\`](${payload.pull_request.html_url}) ${payload.pull_request.title}`
}
