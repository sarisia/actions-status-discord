import { formatEvent } from '../src/format'
import { Inputs } from '../src/input'
import { getPayload } from '../src/main'

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
    const baseInputs: Inputs = {
        nocontext: false,
        noprefix: false,
        webhooks: ['https://webhook.invalid'],
        status: 'success',
        description: '',
        title: '',
        image: '',
        color: NaN,
        username: '',
        avatar_url: ''
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
