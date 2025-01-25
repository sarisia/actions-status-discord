import { getInputs } from '../src/input'

describe("getInputs()", () => {
    beforeEach(() => {
        // do we have more convenient way?
        for (const prop in process.env) {
            if (prop.startsWith("INPUT_"))
                delete process.env[prop]
        }
        delete process.env['DISCORD_WEBHOOK']

        // see action.yml for default values
        process.env['INPUT_STATUS'] = 'success'
        process.env['INPUT_TITLE'] = 'github actions'
        process.env['INPUT_NOFAIL'] = 'true'
        process.env['INPUT_NOCONTEXT'] = 'false'
        process.env['INPUT_NOPREFIX'] = 'false'
        process.env['INPUT_NODETAIL'] = 'false'
        process.env['INPUT_NOTIMESTAMP'] = 'false'
        process.env['INPUT_ACK_NO_WEBHOOK'] = 'false'
    })

    test("each field is mapped correctly", () => {
        // list all fields in Inputs type
        process.env['INPUT_WEBHOOK'] = 'https://env.webhook.invalid'
        process.env['INPUT_STATUS'] = 'failure'
        process.env['INPUT_CONTENT'] = 'content text'
        process.env['INPUT_TITLE'] = 'title text'
        process.env['INPUT_DESCRIPTION'] = 'description text'
        process.env['INPUT_IMAGE'] = 'https://example.com/image.png'
        process.env['INPUT_COLOR'] = '0xabcdef'
        process.env['INPUT_URL'] = 'https://example.com'
        process.env['INPUT_USERNAME'] = 'jest test'
        process.env['INPUT_AVATAR_URL'] = 'https://avatar.webhook.invalid'
        process.env['INPUT_NODETAIL'] = 'false'
        process.env['INPUT_NOCONTEXT'] = 'true'
        process.env['INPUT_NOPREFIX'] = 'true'
        process.env['INPUT_NOTIMESTAMP'] = 'true'
        process.env['INPUT_ACK_NO_WEBHOOK'] = 'true'

        const got = getInputs()
        expect(got.webhooks).toStrictEqual(['https://env.webhook.invalid'])
        expect(got.status).toBe('failure')
        expect(got.content).toBe('content text')
        expect(got.description).toBe('description text')
        expect(got.title).toBe('title text')
        expect(got.image).toBe('https://example.com/image.png')
        expect(got.color).toBe(0xabcdef)
        expect(got.url).toBe('https://example.com')
        expect(got.username).toBe('jest test')
        expect(got.avatar_url).toBe('https://avatar.webhook.invalid')
        expect(got.nocontext).toBe(true)
        expect(got.noprefix).toBe(true)
        expect(got.notimestamp).toBe(true)
        expect(got.ack_no_webhook).toBe(true)
    })

    test("multiple webhooks", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        const got = getInputs()
        expect(got.webhooks).toStrictEqual([
            'https://input.webhook.invalid',
            'https://input2.webhook.invalid'
        ])
    })

    test("DISCORD_WEBHOOK works as webhook", () => {
        process.env['DISCORD_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        const got = getInputs()
        expect(got.webhooks).toStrictEqual([
            'https://input.webhook.invalid',
            'https://input2.webhook.invalid'
        ])
    })

    test("webhook overrides DISCORD_WEBHOOK", () => {
        process.env['DISCORD_WEBHOOK'] = 'https://env.webhook.invalid'
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        const got = getInputs()
        expect(got.webhooks).toStrictEqual([
            'https://input.webhook.invalid',
            'https://input2.webhook.invalid'
        ])
    })

    test("job works as title", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_JOB'] = 'job'

        const got = getInputs()
        expect(got.title).toBe('job')
    })

    test("job overrides title", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_TITLE'] = 'title'
        process.env['INPUT_JOB'] = 'job'

        const got = getInputs()
        expect(got.title).toBe('job')
    })

    test.each([
        '0xabcdef',
        '0xABCDEF',
        '11259375', // 0xabcdef
        '11259375.123', // 0xabcdef
    ])('color parses int-like (%s)', (color) => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_COLOR'] = color
    
        const got = getInputs()
        expect(got.color).toBe(0xabcdef)
    })

    test.each([
        '0x',
        'qwertyuiop',
        '0xqwerty',
        'abcdef',
    ])("color is undefined if not int-like (%s)", (color) => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_COLOR'] = color
    
        const got = getInputs()
        expect(got.color).toBe(undefined)
    })

    test("nocontext and noprefix are respected by default", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_NOCONTEXT'] = 'true'
        process.env['INPUT_NOPREFIX'] = 'true'

        const got = getInputs()
        expect(got.nocontext).toBe(true)
        expect(got.noprefix).toBe(true)
    })

    test("if nodetail is set, nocontext and noprefix are forced to true", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_NODETAIL'] = 'true'
        process.env['INPUT_NOCONTEXT'] = 'false'
        process.env['INPUT_NOPREFIX'] = 'false'

        const got = getInputs()
        expect(got.nocontext).toBe(true)
        expect(got.noprefix).toBe(true)
    })

    test("if nodetail is not set, nocontext and noprefix are respected to user choice", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_NODETAIL'] = 'false'
        process.env['INPUT_NOCONTEXT'] = 'false'
        process.env['INPUT_NOPREFIX'] = 'false'

        const got = getInputs()
        expect(got.nocontext).toBe(false)
        expect(got.noprefix).toBe(false)
    })

    test("empty webhook raises by default", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_WEBHOOK'] = '\n\n\n'
        expect(getInputs).toThrow('No webhook is given. If this is intended, you can suppress this error by setting `ack_no_webhook` to `true`.')
    })

    test("empty webhook raises when ack_no_webhook is not set", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_WEBHOOK'] = '\n\n\n'
        process.env['INPUT_ACK_NO_WEBHOOK'] = 'false'
        expect(getInputs).toThrow('No webhook is given. If this is intended, you can suppress this error by setting `ack_no_webhook` to `true`.')
    })

    test("empty webhook did not raise when ack_no_webhook is set", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_WEBHOOK'] = '\n\n\n'
        process.env['INPUT_ACK_NO_WEBHOOK'] = 'true'
        const got = getInputs()

        expect(got.webhooks).toStrictEqual([])
    })

    test("invalid status raises", () => {
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_STATUS'] = 'invalid'
        expect(getInputs).toThrow('invalid status value: invalid')
    })
})
