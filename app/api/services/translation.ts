
import { post, get } from '../utils/api-client'
import { getEndpointUrl, API_TIMEOUTS, API_ENDPOINTS } from '../config/endpoints'
import { extractFirstAvailable } from '../utils/response-handlers'
import type {
    Language,
    ApiLanguageCode,
    TranslationRequest,
    TranslationResponse,
    TranslationResult,
} from '../types/translation.types'


export function toApiLanguageCode(lang: Language | 'Kirundi'): ApiLanguageCode {
    switch (lang) {
        case 'Français':
            return 'F'
        case 'English':
            return 'E'
        case 'Swahili':
            return 'S'
        case 'Kirundi':
            return 'K'
        default:
            return 'K'
    }
}


export async function translateText(
    text: string,
    fromLang: Language | 'Kirundi',
    toLang: Language
): Promise<TranslationResult> {
    if (!text.trim()) {
        return {
            text: '',
            from: fromLang as Language,
            to: toLang,
        }
    }

    const from = toApiLanguageCode(fromLang)
    const to = toApiLanguageCode(toLang)
    const direction = `${from}→${to}`

    const url = getEndpointUrl('TRANSLATION', '/translate') // The second param is a relative path. The user's curl used /translate.

    const requestBody: TranslationRequest = {
        text: text.trim(),
        direction,
    }

    const response = await post<TranslationResponse>(url, requestBody, {
        timeout: API_TIMEOUTS.TRANSLATION,
    })

    if (response.error) {
        throw new Error(response.error)
    }

    // Try to extract translation from multiple possible fields
    const translatedText = extractFirstAvailable<string>(response.data, [
        'translation',
        'translated_text',
        'translatedText',
        'result',
        'data.translation',
    ])

    if (!translatedText || !translatedText.trim()) {
        throw new Error('No translation returned by the server.')
    }

    return {
        text: translatedText,
        from: fromLang as Language,
        to: toLang,
    }
}

/**
 * Search for words in the translation-specific dictionary/database
 */
export async function searchTranslationWords(query: string, limit: number = 10): Promise<any[]> {
    if (!query.trim()) return []

    const url = getEndpointUrl('TRANSLATION', API_ENDPOINTS.TRANSLATION.SEARCH)
    const response = await get<any[]>(`${url}?limit=${limit}`)

    if (response.error || !response.data) {
        console.error('Translation Suggestion Error:', response.error)
        return []
    }

    return response.data
}
