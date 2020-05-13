import { Inputs } from '../src/input'
import { getPayload } from '../src/main'
import { formatEvent } from '../src/format'

const base: Inputs = {
    nodetail: false,
    webhooks: ['https://webhook.invalid'],
    status: 'success',
    description: '',
    job: '',
    color: NaN,
    username: '',
    avatar_url: ''
}

jest.mock('@actions/github', () => {
    return {
        context: {
            repo: {
                owner: 'Codertocat',
                repo: 'Hello-World'
            },
            eventName: 'push',
            sha: '6113728f27ae82c7b1a177c8d03f9e96e0adf246',
            ref: 'refs/tags/simple-tag',
            workflow: 'push-ci',
            actor: 'Codertocat',
            payload: require('./payload/push_tag.json')

        }
    }
})

jest.mock('../src/format')
const mockedFormatEvent = formatEvent as jest.Mock
mockedFormatEvent.mockReturnValue("mocked format event")

describe('getPayload(Inputs)', () => {
    test("default", () => {
        const inputs: Inputs = {
            nodetail: false,
            webhooks: ['https://webhook.invalid'],
            status: 'success',
            description: '',
            job: '',
            color: NaN,
            username: '',
            avatar_url: ''
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://github.com/Codertocat/Hello-World)',
                        inline: true
                    },
                    {
                        name: 'Ref',
                        value: 'refs/tags/simple-tag',
                        inline: true
                    },
                    {
                        name: 'Event - push',
                        value: 'mocked format event',
                        inline: false
                    },
                    {
                        name: 'Triggered by',
                        value: 'Codertocat',
                        inline: true
                    },
                    {
                        name: 'Workflow',
                        value: "[push-ci](https://github.com/Codertocat/Hello-World/commit/6113728f27ae82c7b1a177c8d03f9e96e0adf246/checks)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("nodetail", () => {
        const inputs: Inputs = {
            nodetail: true,
            webhooks: ['https://webhook.invalid'],
            status: 'success',
            description: '',
            job: '',
            color: NaN,
            username: '',
            avatar_url: ''
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String)
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("nodetail with job", () => {
        const inputs: Inputs = {
            nodetail: true,
            webhooks: ['https://webhook.invalid'],
            status: 'success',
            description: '',
            job: 'nodetail title',
            color: NaN,
            username: '',
            avatar_url: ''
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'nodetail title'
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("description", () => {
        const inputs: Inputs = {
            nodetail: false,
            webhooks: ['https://webhook.invalid'],
            status: 'success',
            description: 'description test',
            job: '',
            color: NaN,
            username: '',
            avatar_url: ''
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success',
                description: 'description test',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://github.com/Codertocat/Hello-World)',
                        inline: true
                    },
                    {
                        name: 'Ref',
                        value: 'refs/tags/simple-tag',
                        inline: true
                    },
                    {
                        name: 'Event - push',
                        value: 'mocked format event',
                        inline: false
                    },
                    {
                        name: 'Triggered by',
                        value: 'Codertocat',
                        inline: true
                    },
                    {
                        name: 'Workflow',
                        value: "[push-ci](https://github.com/Codertocat/Hello-World/commit/6113728f27ae82c7b1a177c8d03f9e96e0adf246/checks)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("job", () => {
        const inputs: Inputs = {
            nodetail: false,
            webhooks: ['https://webhook.invalid'],
            status: 'success',
            description: '',
            job: 'job test',
            color: NaN,
            username: '',
            avatar_url: ''
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success: job test',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://github.com/Codertocat/Hello-World)',
                        inline: true
                    },
                    {
                        name: 'Ref',
                        value: 'refs/tags/simple-tag',
                        inline: true
                    },
                    {
                        name: 'Event - push',
                        value: 'mocked format event',
                        inline: false
                    },
                    {
                        name: 'Triggered by',
                        value: 'Codertocat',
                        inline: true
                    },
                    {
                        name: 'Workflow',
                        value: "[push-ci](https://github.com/Codertocat/Hello-World/commit/6113728f27ae82c7b1a177c8d03f9e96e0adf246/checks)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("color", () => {
        const inputs: Inputs = {
            nodetail: false,
            webhooks: ['https://webhook.invalid'],
            status: 'success',
            description: '',
            job: '',
            color: 0xfff000,
            username: '',
            avatar_url: ''
        }
        const want = {
            embeds: [{
                color: 0xfff000,
                timestamp: expect.any(String),
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://github.com/Codertocat/Hello-World)',
                        inline: true
                    },
                    {
                        name: 'Ref',
                        value: 'refs/tags/simple-tag',
                        inline: true
                    },
                    {
                        name: 'Event - push',
                        value: 'mocked format event',
                        inline: false
                    },
                    {
                        name: 'Triggered by',
                        value: 'Codertocat',
                        inline: true
                    },
                    {
                        name: 'Workflow',
                        value: "[push-ci](https://github.com/Codertocat/Hello-World/commit/6113728f27ae82c7b1a177c8d03f9e96e0adf246/checks)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("username", () => {
        const inputs: Inputs = {
            nodetail: false,
            webhooks: ['https://webhook.invalid'],
            status: 'success',
            description: '',
            job: '',
            color: NaN,
            username: 'username test',
            avatar_url: ''
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://github.com/Codertocat/Hello-World)',
                        inline: true
                    },
                    {
                        name: 'Ref',
                        value: 'refs/tags/simple-tag',
                        inline: true
                    },
                    {
                        name: 'Event - push',
                        value: 'mocked format event',
                        inline: false
                    },
                    {
                        name: 'Triggered by',
                        value: 'Codertocat',
                        inline: true
                    },
                    {
                        name: 'Workflow',
                        value: "[push-ci](https://github.com/Codertocat/Hello-World/commit/6113728f27ae82c7b1a177c8d03f9e96e0adf246/checks)",
                        inline: true
                    }
                ]
            }],
            username: 'username test'
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("avatar_url", () => {
        const inputs: Inputs = {
            nodetail: false,
            webhooks: ['https://webhook.invalid'],
            status: 'success',
            description: '',
            job: '',
            color: NaN,
            username: '',
            avatar_url: 'https://avatar.invalid/avatar.png'
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://github.com/Codertocat/Hello-World)',
                        inline: true
                    },
                    {
                        name: 'Ref',
                        value: 'refs/tags/simple-tag',
                        inline: true
                    },
                    {
                        name: 'Event - push',
                        value: 'mocked format event',
                        inline: false
                    },
                    {
                        name: 'Triggered by',
                        value: 'Codertocat',
                        inline: true
                    },
                    {
                        name: 'Workflow',
                        value: "[push-ci](https://github.com/Codertocat/Hello-World/commit/6113728f27ae82c7b1a177c8d03f9e96e0adf246/checks)",
                        inline: true
                    }
                ]
            }],
            avatar_url: "https://avatar.invalid/avatar.png"
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })
})
