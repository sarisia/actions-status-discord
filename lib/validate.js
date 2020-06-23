"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fitEmbed = exports.truncStr = void 0;
const constants = __importStar(require("./constants"));
const utils_1 = require("./utils");
function truncStr(msg, length) {
    return msg.slice(0, length - 3) + '...';
}
exports.truncStr = truncStr;
function fitEmbed(embed) {
    if (embed.title) {
        const titleLen = embed.title.length;
        if (titleLen > constants.MAX_EMBED_TITLE_LENGTH) {
            utils_1.logWarning(`embed title must be shorter than ${constants.MAX_EMBED_TITLE_LENGTH}, got ${titleLen}\n    ${embed.title}`);
            embed.title = truncStr(embed.title, constants.MAX_EMBED_TITLE_LENGTH);
        }
    }
    if (embed.description) {
        const descLen = embed.description.length;
        if (descLen > constants.MAX_EMBED_DESCRIPTION_LENGTH) {
            utils_1.logWarning(`embed description must be shorter than ${constants.MAX_EMBED_DESCRIPTION_LENGTH}, got ${descLen}\n    ${embed.description}`);
            embed.description = truncStr(embed.description, constants.MAX_EMBED_DESCRIPTION_LENGTH);
        }
    }
    if (embed.fields) {
        for (const field of embed.fields) {
            const nameLen = field.name.length;
            const valueLen = field.value.length;
            if (nameLen > constants.MAX_EMBED_FIELD_NAME_LENGTH) {
                utils_1.logWarning(`embed field name must be shorter than ${constants.MAX_EMBED_FIELD_NAME_LENGTH}, got ${nameLen}\n    ${field.name}`);
                field.name = truncStr(field.name, constants.MAX_EMBED_FIELD_NAME_LENGTH);
            }
            if (valueLen > constants.MAX_EMBED_FIELD_VALUE_LENGTH) {
                utils_1.logWarning(`embed field value must be shorter than ${constants.MAX_EMBED_FIELD_VALUE_LENGTH}, got ${valueLen}\n    ${field.value}`);
                field.value = truncStr(field.value, constants.MAX_EMBED_FIELD_VALUE_LENGTH);
            }
        }
    }
    return embed;
}
exports.fitEmbed = fitEmbed;
