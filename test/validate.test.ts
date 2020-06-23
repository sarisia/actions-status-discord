import { fitEmbed, truncStr } from '../src/validate'
import * as constants from '../src/constants'

describe('truncStr(string)', () => {
    test('truncStr', () => {
        const targetLen = 2000
        const input = 'a'.repeat(targetLen + 1)
        const want = 'a'.repeat(targetLen - 3) + '...'
        const got = truncStr(input, targetLen)
        expect(got).toBe(want)
    })
})

describe('fitEmbed(embed)', () => {
    test('too long title', () => {
        const input = {
            color: 0x28A745,
            timestamp: expect.any(String),
            title: 'Success: ' + 'a'.repeat(constants.MAX_EMBED_TITLE_LENGTH + 1),
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
        }
        const want = {
            color: 0x28A745,
            timestamp: expect.any(String),
            title: 'Success: ' + 'a'.repeat(constants.MAX_EMBED_TITLE_LENGTH - 9 - 3) + '...',
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
        }
        const got = fitEmbed(input)
        expect(got).toStrictEqual(want)
    })

    test('too long description', () => {
        const input = {
            color: 0x28A745,
            timestamp: expect.any(String),
            title: 'Success',
            description: 'a'.repeat(constants.MAX_EMBED_DESCRIPTION_LENGTH + 1),
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
        }
        const want = {
            color: 0x28A745,
            timestamp: expect.any(String),
            title: 'Success',
            description: 'a'.repeat(constants.MAX_EMBED_DESCRIPTION_LENGTH - 3) + '...',
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
        }

        const got = fitEmbed(input)
        expect(got).toStrictEqual(want)
    })

    test('too long field name', () => {
        const input = {
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
                    name: 'Event - ' + 'a'.repeat(constants.MAX_EMBED_FIELD_NAME_LENGTH + 1),
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
        }
        const want = {
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
                    name: 'Event - ' + 'a'.repeat(constants.MAX_EMBED_FIELD_NAME_LENGTH - 8 - 3) + '...',
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
        }

        const got = fitEmbed(input)
        expect(got).toStrictEqual(want)
    })

    test('too long field value', () => {
        const input = {
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
                    value: 'a'.repeat(constants.MAX_EMBED_FIELD_VALUE_LENGTH + 1),
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
        }
        const want = {
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
                    value: 'a'.repeat(constants.MAX_EMBED_FIELD_VALUE_LENGTH - 3) + '...',
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
        }

        const got = fitEmbed(input)
        expect(got).toStrictEqual(want)
    })
})
