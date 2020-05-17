import { getInputs } from '../src/input'

describe("getInputs()", () => {
    beforeEach(() => {
        // see action.yml for default values
        process.env['INPUT_STATUS'] = 'success'
        process.env['INPUT_NOFAIL'] = 'true'
        process.env['INPUT_NODETAIL'] = 'false'

        process.env['DISCORD_WEBHOOK'] = "https://env.webhook.invalid"
    })

    test("default", () => {
        const got = getInputs()
        expect(got.nodetail).toBe(false)
        expect(got.webhooks).toStrictEqual(["https://env.webhook.invalid"])
        expect(got.status).toBe('success')
        expect(got.description).toBe('')
        expect(got.job).toBe('')
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

    test("all", () => {
        process.env['INPUT_NODETAIL'] = 'true'
        process.env['INPUT_WEBHOOK'] = '\nhttps://input.webhook.invalid\n\n\nhttps://input2.webhook.invalid\n\n\n'
        process.env['INPUT_STATUS'] = 'Cancelled'
        process.env['INPUT_DESCRIPTION'] = 'description text'
        process.env['INPUT_JOB'] = 'job text\n\n\n\n\n'
        process.env['INPUT_COLOR'] = '0xffffff'
        process.env['INPUT_USERNAME'] = 'jest test'
        process.env['INPUT_AVATAR_URL'] = '\n\n\nhttps://avatar.webhook.invalid\n'

        const got = getInputs()
        expect(got.nodetail).toBe(true)
        expect(got.webhooks).toStrictEqual([
            'https://input.webhook.invalid',
            'https://input2.webhook.invalid'
        ])
        expect(got.status).toBe('cancelled')
        expect(got.description).toBe('description text')
        expect(got.job).toBe('job text')
        expect(got.color).toBe(0xffffff)
        expect(got.username).toBe('jest test')
        expect(got.avatar_url).toBe('https://avatar.webhook.invalid')
    })
})
