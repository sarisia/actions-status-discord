import { getInputs } from '../src/input'

describe("getInputs()", () => {
    beforeEach(() => {
        // do we have more convenient way?
        delete process.env['INPUT_NODETAIL']
        delete process.env['INPUT_NOCONTEXT']
        delete process.env['INPUT_NOPREFIX']
        delete process.env['INPUT_WEBHOOK']
        delete process.env['INPUT_STATUS']
        delete process.env['INPUT_DESCRIPTION']
        delete process.env['INPUT_JOB']
        delete process.env['INPUT_TITLE']
        delete process.env['INPUT_COLOR']
        delete process.env['INPUT_USERNAME']
        delete process.env['INPUT_AVATAR_URL']

        // see action.yml for default values
        process.env['INPUT_STATUS'] = 'success'
        process.env['INPUT_NOFAIL'] = 'true'
        process.env['INPUT_NODETAIL'] = 'false'

        process.env['DISCORD_WEBHOOK'] = "https://env.webhook.invalid"
    })

    test("default", () => {
        const got = getInputs()
        expect(got.noprefix).toBe(false)
        expect(got.nocontext).toBe(false)
        expect(got.webhooks).toStrictEqual(["https://env.webhook.invalid"])
        expect(got.status).toBe('success')
        expect(got.description).toBe('')
        expect(got.title).toBe('')
        expect(got.color).toBeFalsy()
        expect(got.username).toBe('')
        expect(got.avatar_url).toBe('')
    })

    test("no webhooks", () => {
        delete process.env['DISCORD_WEBHOOK']
        expect(getInputs).toThrow("no webhook is given")
    })

    test("invalid status", () => {
        process.env['INPUT_STATUS'] = 'invalid'
        expect(getInputs).toThrow('invalid status value: invalid')
    })

    test("override job by title", () => {
        process.env['INPUT_JOB'] = 'job'
        process.env['INPUT_TITLE'] = 'title'

        const got = getInputs()
        expect(got.title).toBe('title')
    })

    test("nocontext", () => {
        process.env['INPUT_NOCONTEXT'] = 'true'
        const got = getInputs()
        expect(got.nocontext).toBe(true)
        expect(got.noprefix).toBe(false)
    })

    test("noprefix", () => {
        process.env['INPUT_NOPREFIX'] = 'true'
        const got = getInputs()
        expect(got.nocontext).toBe(false)
        expect(got.noprefix).toBe(true)
    })

    test("nodetail", () => {
        process.env['INPUT_NODETAIL'] = 'true'
        const got = getInputs()
        expect(got.nocontext).toBe(true)
        expect(got.noprefix).toBe(true)
    })

    test("all (job)", () => {
        process.env['INPUT_NODETAIL'] = 'true'
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_STATUS'] = 'Cancelled'
        process.env['INPUT_DESCRIPTION'] = 'description text'
        process.env['INPUT_JOB'] = 'job text\n\n\n\n\n'
        process.env['INPUT_COLOR'] = '0xffffff'
        process.env['INPUT_USERNAME'] = 'jest test'
        process.env['INPUT_AVATAR_URL'] = '\n\n\nhttps://avatar.webhook.invalid\n'

        const got = getInputs()
        expect(got.noprefix).toBe(true)
        expect(got.nocontext).toBe(true)
        expect(got.webhooks).toStrictEqual([
            'https://input.webhook.invalid',
            'https://input2.webhook.invalid'
        ])
        expect(got.status).toBe('cancelled')
        expect(got.description).toBe('description text')
        expect(got.title).toBe('job text')
        expect(got.color).toBe(0xffffff)
        expect(got.username).toBe('jest test')
        expect(got.avatar_url).toBe('https://avatar.webhook.invalid')
    })

    test("all (title)", () => {
        process.env['INPUT_NODETAIL'] = 'true'
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_STATUS'] = 'Cancelled'
        process.env['INPUT_DESCRIPTION'] = 'description text'
        process.env['INPUT_TITLE'] = 'job text\n\n\n\n\n'
        process.env['INPUT_COLOR'] = '0xffffff'
        process.env['INPUT_USERNAME'] = 'jest test'
        process.env['INPUT_AVATAR_URL'] = '\n\n\nhttps://avatar.webhook.invalid\n'

        const got = getInputs()
        expect(got.noprefix).toBe(true)
        expect(got.nocontext).toBe(true)
        expect(got.webhooks).toStrictEqual([
            'https://input.webhook.invalid',
            'https://input2.webhook.invalid'
        ])
        expect(got.status).toBe('cancelled')
        expect(got.description).toBe('description text')
        expect(got.title).toBe('job text')
        expect(got.color).toBe(0xffffff)
        expect(got.username).toBe('jest test')
        expect(got.avatar_url).toBe('https://avatar.webhook.invalid')
    })
})
