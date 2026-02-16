
export const API_ENDPOINTS = {

    TRANSLATION: {
        BASE_URL: '/api/translation-proxy',
        TRANSLATE: '/translate',
        SEARCH: '/translate',
    },


    CHAT: {
        BASE_URL: '/api/chat-proxy',
        SEND_MESSAGE: '/chat/',
    },


    DICTIONARY: {
        BASE_URL: '/api/dictionary-proxy',
        SEARCH: '/words',
        GET_ENTRY: '/dictionary/entry',
    },


    VERBS: {
        BASE_URL: '/api/verbs-proxy',
        SEARCH: '/verbe',
        GET_CONJUGATION: ''
    },

    DISCOVER: {
        BASE_URL: '/api/news-proxy',
        EVERYTHING: '/everything'
    },
} as const


export const API_TIMEOUTS = {
    DEFAULT: 30000,
    TRANSLATION: 15000,
    CHAT: 60000,
} as const


export function getEndpointUrl(service: keyof typeof API_ENDPOINTS, endpoint: string): string {
    const serviceConfig = API_ENDPOINTS[service]
    const baseUrl = serviceConfig.BASE_URL

    if (!baseUrl) {
        throw new Error(`Base URL not configured for service: ${service}`)
    }

    return `${baseUrl}${endpoint}`
}
