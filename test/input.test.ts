import { getInputs } from '../src/input'

describe("getInputs()", () => {
    beforeEach(() => {
        // do we have more convenient way?
        for (const prop in process.env) {
            if (prop.startsWith("INPUT_"))
                delete process.env[prop]
        }

        // see action.yml for default values
        process.env['INPUT_STATUS'] = 'success'
        process.env['INPUT_TITLE'] = 'github actions'
        process.env['INPUT_NOFAIL'] = 'true'
        process.env['INPUT_NOCONTEXT'] = 'false'
        process.env['INPUT_NOPREFIX'] = 'false'
        process.env['INPUT_NODETAIL'] = 'false'
        process.env['INPUT_NOTIMESTAMP'] = 'false'
        process.env['INPUT_ACKNOWEBHOOK'] = 'false'

        // no defaults in action.yml, but need for passing validation
        process.env['DISCORD_WEBHOOK'] = "https://env.webhook.invalid"
    })

    test("default", () => {
        const got = getInputs()
        expect(got.noprefix).toBe(false)
        expect(got.nocontext).toBe(false)
        expect(got.webhooks).toStrictEqual(["https://env.webhook.invalid"])
        expect(got.status).toBe('success')
        expect(got.content).toBe('')
        expect(got.description).toBe('')
        expect(got.title).toBe('github actions')
        expect(got.image).toBe('')
        expect(got.color).toBe(undefined)
        expect(got.username).toBe('')
        expect(got.avatar_url).toBe('')
        expect(got.ack_no_webhook).toBe(false)
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

    test("color 0 is accepted", () => {
        process.env['INPUT_COLOR'] = '0'
        const got = getInputs()
        expect(got.color).toBe(0)
    })
    
    test("invalid color is defaulted to undefined", () => {
        process.env['INPUT_COLOR'] = 'qwertyuiop'
        const got = getInputs()
        expect(got.color).toBe(undefined)
    })

    test("all (job)", () => {
        // this pattern is rare because we have default value
        // for INPUT_TITLE, defined in action.yml, so this pattern
        // happens only the user make the option blank manually
        process.env['INPUT_TITLE'] = ''

        process.env['INPUT_NODETAIL'] = 'true'
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_STATUS'] = 'Cancelled'
        process.env['INPUT_CONTENT'] = "\n\nhey i'm mentioning \n<@316911818725392384>\n"
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
        expect(got.content).toBe("hey i'm mentioning \n<@316911818725392384>")
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
        process.env['INPUT_CONTENT'] = "\n\nhey i'm mentioning \n<@316911818725392384>\n"
        process.env['INPUT_DESCRIPTION'] = 'description text'
        process.env['INPUT_TITLE'] = 'job text\n\n\n\n\n'
        process.env['INPUT_IMAGE'] = '\n\nhttps://example.com/inputimage.png'
        process.env['INPUT_COLOR'] = '0xffffff'
        process.env['INPUT_USERNAME'] = 'jest test'
        process.env['INPUT_AVATAR_URL'] = '\n\n\nhttps://avatar.webhook.invalid\n'
        process.env['INPUT_ACK_NO_WEBHOOK'] = 'true'

        const got = getInputs()
        expect(got.noprefix).toBe(true)
        expect(got.nocontext).toBe(true)
        expect(got.webhooks).toStrictEqual([
            'https://input.webhook.invalid',
            'https://input2.webhook.invalid'
        ])
        expect(got.status).toBe('cancelled')
        expect(got.content).toBe("hey i'm mentioning \n<@316911818725392384>")
        expect(got.description).toBe('description text')
        expect(got.title).toBe('job text')
        expect(got.image).toBe('https://example.com/inputimage.png')
        expect(got.color).toBe(0xffffff)
        expect(got.username).toBe('jest test')
        expect(got.avatar_url).toBe('https://avatar.webhook.invalid')
        expect(got.noprefix).toBe(true)
    })
})
