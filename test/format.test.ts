import { formatEvent } from '../src/format'
import pull_request from './payload/pull_request.json'
import push_branch from './payload/push_branch.json'
import push_tag from './payload/push_tag.json'

describe('formatEvent(event, payload)', () => {
    test('no formatter', () => {
        const got = formatEvent('no formatter', {})
        expect(got).toBe('No further information')
    })

    test('pull_request', () => {
        const got = formatEvent('pull_request', pull_request)
        expect(got).toBe('[`#2`](https://github.com/Codertocat/Hello-World/pull/2) Update the README with new information.')
    })

    test('push branch', () => {
        const got = formatEvent('push', push_branch)
        expect(got).toBe('[`edccba2`](https://github.com/neuenmuller/actions-status-discord-test/commit/edccba2549a0a9a8545acfd4694f96481ddb16ca) refactor: fix webhook empty string')
    })

    test('push tag', () => {
        const got = formatEvent('push', push_tag)
        expect(got).toBe('No further information')
    })
})
