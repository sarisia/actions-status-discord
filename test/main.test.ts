import { formatEvent } from '../src/format'
import { Inputs } from '../src/input'
import { getPayload } from '../src/main'

// see https://github.com/actions/toolkit/blob/457303960f03375db6f033e214b9f90d79c3fe5c/packages/github/src/context.ts
// and https://docs.github.com/en/actions/learn-github-actions/contexts#github-context
jest.mock('@actions/github', () => {
    return {
        context: {
            payload: require('./payload/push_tag.json'),

            eventName: 'push',
            sha: '6113728f27ae82c7b1a177c8d03f9e96e0adf246',
            ref: 'refs/tags/simple-tag',
            workflow: 'push-ci',
            actor: 'Codertocat',
            runId: 123123,
            serverUrl: "https://githubactions.serverurl.example.com",

            repo: {
                owner: 'Codertocat',
                repo: 'Hello-World'
            },

        }
    }
})

jest.mock('../src/format')
const mockedFormatEvent = formatEvent as jest.Mock
mockedFormatEvent.mockReturnValue("mocked format event")

describe('getPayload(Inputs)', () => {
    const baseInputs: Inputs = {
        nocontext: false,
        noprefix: false,
        notimestamp: false,
        webhooks: ['https://webhook.invalid'],
        status: 'success',
        description: '',
        content: '',
        title: '',
        image: '',
        color: undefined,
        url: '',
        username: '',
        avatar_url: '',
        ack_no_webhook: false
    }

    test("default", () => {
        const inputs: Inputs = {
            ...baseInputs
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("nodetail", () => {
        const inputs: Inputs = {
            ...baseInputs,
            nocontext: true,
            noprefix: true,
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
            ...baseInputs,
            nocontext: true,
            noprefix: true,
            title: 'nodetail title',
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

    test("nocontext", () => {
        const inputs: Inputs = {
            ...baseInputs,
            nocontext: true,
            title: 'nocontext title',
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: "Success: nocontext title"
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("nocontext with notimestamp", () => {
        const inputs: Inputs = {
            ...baseInputs,
            nocontext: true,
            notimestamp: true,
            title: 'nocontext title',
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                title: "Success: nocontext title"
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })


    test("notimestamp", () => {
        const inputs: Inputs = {
            ...baseInputs,
            notimestamp: true
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("noprefix", () => {
        const inputs: Inputs = {
            ...baseInputs,
            noprefix: true,
            title: 'noprefix title',
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'noprefix title',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("description", () => {
        const inputs: Inputs = {
            ...baseInputs,
            description: 'description test',
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
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("title", () => {
        const inputs: Inputs = {
            ...baseInputs,
            title: 'job test',
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success: job test',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("url", () => {
        const inputs: Inputs = {
            ...baseInputs,
            title: 'job test',
            url: "https://example.com"
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success: job test',
                url: 'https://example.com',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("image", () => {
        const inputs: Inputs = {
            ...baseInputs,
            image: "https://example.com/testimage.png"
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success',
                image: {
                    url: "https://example.com/testimage.png"
                },
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
    })

    test("color", () => {
        const inputs: Inputs = {
            ...baseInputs,
            color: 0xfff000,
        }
        const want = {
            embeds: [{
                color: 0xfff000,
                timestamp: expect.any(String),
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("no color defaults to job status color", () => {
        const inputs: Inputs = {
            ...baseInputs,
            status: "failure"
        }
        const want = {
            embeds: [{
                color: 0xCB2431,
                timestamp: expect.any(String),
                title: 'Failure',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("color 0 is accepted", () => {
        const inputs: Inputs = {
            ...baseInputs,
            color: 0,
        }
        const want = {
            embeds: [{
                color: 0,
                timestamp: expect.any(String),
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }]
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })


    test("username", () => {
        const inputs: Inputs = {
            ...baseInputs,
            username: 'username test',
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
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
            ...baseInputs,
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
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }],
            avatar_url: "https://avatar.invalid/avatar.png"
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })

    test("content", () => {
        const inputs: Inputs = {
            ...baseInputs,
            content: "hey i'm mentioning <@316911818725392384>"
        }
        const want = {
            embeds: [{
                color: 0x28A745,
                timestamp: expect.any(String),
                title: 'Success',
                fields: [
                    {
                        name: 'Repository',
                        value: '[Codertocat/Hello-World](https://githubactions.serverurl.example.com/Codertocat/Hello-World)',
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
                        value: "[push-ci](https://githubactions.serverurl.example.com/Codertocat/Hello-World/actions/runs/123123)",
                        inline: true
                    }
                ]
            }],
            content: "hey i'm mentioning <@316911818725392384>"
        }
        expect(getPayload(inputs)).toStrictEqual(want)
    })
})
