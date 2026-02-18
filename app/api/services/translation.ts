
import { get, post } from '../utils/api-client'
import { getEndpointUrl, API_TIMEOUTS, API_ENDPOINTS } from '../config/endpoints'
import type {
    Language,
    ApiLanguageCode,
    TranslationResponse,
    TranslationResult,
} from '../types/translation.types'

function extractTranslationText(data: any): string | null {
    if (!data) return null

    const direct =
        data.translation ||
        data.translated_text ||
        data.translatedText ||
        data.result ||
        data.text ||
        data?.data?.translation ||
        data?.data?.translated_text ||
        data?.data?.translatedText ||
        data?.data?.result ||
        data?.data?.text

    if (typeof direct === 'string' && direct.trim()) {
        return direct
    }

    if (Array.isArray(data) && data.length > 0) {
        const first = data[0]
        const fromArray =
            first?.translation ||
            first?.translated_text ||
            first?.translatedText ||
            first?.result ||
            first?.text ||
            first?.word ||
            first?.value

        if (typeof fromArray === 'string' && fromArray.trim()) {
            return fromArray
        }
    }

    return null
}


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
    const direction = ` ${from}→${to}`

    const url = getEndpointUrl('TRANSLATION', API_ENDPOINTS.TRANSLATION.TRANSLATE)

    const payload = {
        text: text.trim(),
        direction: direction
    }

    const response = await post<TranslationResponse>(url, payload, {
        timeout: API_TIMEOUTS.TRANSLATION,
    })

    const translatedText = extractTranslationText(response.data)

    if (!translatedText || !translatedText.trim()) {
        throw new Error(response.error || 'No translation found.')
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
    const attempts: Record<string, string>[] = [
        { mot: query.trim(), limit: String(limit) },
        { query: query.trim(), limit: String(limit) },
        { q: query.trim(), limit: String(limit) },
    ]

    for (const params of attempts) {
        const qs = new URLSearchParams(params).toString()
        const response = await get<any>(`${url}?${qs}`)

        if (response.error || !response.data) continue

        const data = response.data as any

        if (Array.isArray(data)) return data
        if (Array.isArray(data?.results)) return data.results
        if (Array.isArray(data?.data)) return data.data
        if (Array.isArray(data?.items)) return data.items
        if (Array.isArray(data?.words)) return data.words
    }

    return []
}
