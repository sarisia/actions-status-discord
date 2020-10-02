import * as core from '@actions/core'

const NOFAIL: boolean = core.getInput('nofail').trim().toLowerCase() === 'true'

export function logError(msg: string) {
    NOFAIL ? core.error(msg) : core.setFailed(msg)
}

export function logDebug(msg: string) {
    core.debug(msg)
}

export function logInfo(msg: string) {
    core.info(msg)
}

export function logWarning(msg: string) {
    core.warning(msg)
}

export function stob(s: string): boolean {
    return s.trim().toLowerCase() === 'true'
}
