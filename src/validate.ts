import * as constants from './constants'
import { logWarning } from './utils'

export function truncStr(msg: string, length: number) {
    return msg.slice(0, length-3) + '...'
}

export function fitEmbed(embed: any): any {
    if (embed.title) {
        const titleLen = embed.title.length
        if (titleLen > constants.MAX_EMBED_TITLE_LENGTH) {
            logWarning(`embed title must be shorter than ${constants.MAX_EMBED_TITLE_LENGTH}, got ${titleLen}\n    ${embed.title}`)
            embed.title = truncStr(embed.title, constants.MAX_EMBED_TITLE_LENGTH)
        }
    }
    if (embed.description) {
        const descLen = embed.description.length
        if (descLen > constants.MAX_EMBED_DESCRIPTION_LENGTH) {
            logWarning(`embed description must be shorter than ${constants.MAX_EMBED_DESCRIPTION_LENGTH}, got ${descLen}\n    ${embed.description}`)
            embed.description = truncStr(embed.description, constants.MAX_EMBED_DESCRIPTION_LENGTH)
        }
    }
    if (embed.fields) {
        for (const field of embed.fields) {
            const nameLen = field.name.length
            const valueLen = field.value.length
            if (nameLen > constants.MAX_EMBED_FIELD_NAME_LENGTH) {
                logWarning(`embed field name must be shorter than ${constants.MAX_EMBED_FIELD_NAME_LENGTH}, got ${nameLen}\n    ${field.name}`)
                field.name = truncStr(field.name, constants.MAX_EMBED_FIELD_NAME_LENGTH)
            }
            if (valueLen > constants.MAX_EMBED_FIELD_VALUE_LENGTH) {
                logWarning(`embed field value must be shorter than ${constants.MAX_EMBED_FIELD_VALUE_LENGTH}, got ${valueLen}\n    ${field.value}`)
                field.value = truncStr(field.value, constants.MAX_EMBED_FIELD_VALUE_LENGTH)
            }
        }
    }

    return embed
}
