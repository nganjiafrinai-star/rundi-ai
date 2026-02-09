
import type {
    DictionaryEntry,
    DictionarySearchFilters,
    DictionarySearchResult,
    PartOfSpeech,
} from '../types/dictionary.types'
import { get } from '../utils/api-client'
import { API_ENDPOINTS, getEndpointUrl } from '../config/endpoints'

interface RawDictionaryEntry {
    ijambo: string
    insiguro: string
    "ubwoko bw'ijambo": string | null
    uturorero: string[] | null
    ivyitiranwa: string[] | null
    imvugo: string[] | null
    "imvugo zikoreshwa": string[] | null
    score: number | null
}

function mapRawToEntry(raw: RawDictionaryEntry, index: number): DictionaryEntry {
    const posMap: Record<string, PartOfSpeech> = {
        'noun': 'noun',
        'verb': 'verb',
        'adj': 'adj',
        'adv': 'adv',
        'ikivugo': 'noun',
        'inyigisho': 'noun',
    }

    const rawPos = raw["ubwoko bw'ijambo"] || ''
    const pos = (rawPos ? (posMap[rawPos.toLowerCase()] || 'noun') : 'noun') as PartOfSpeech

    return {
        id: index + 1,
        word: raw.ijambo,
        pos,
        rawPos,
        meaning: raw.insiguro,
        examples: raw.uturorero || [],
        synonyms: raw.ivyitiranwa || [],
        expressions: [
            ...(raw.imvugo || []),
            ...(raw["imvugo zikoreshwa"] || [])
        ],
        tags: [], // Tags were not in the new example, keeping it empty
    }
}

export async function searchDictionary(
    filters: DictionarySearchFilters = {}
): Promise<DictionarySearchResult> {
    const { query = '', limit = 100 } = filters as any // Using any for limit extension

    const url = getEndpointUrl('DICTIONARY', API_ENDPOINTS.DICTIONARY.SEARCH)
    const response = await get<RawDictionaryEntry[]>(`${url}?limit=${limit}`)

    if (response.error || !response.data) {
        console.error('Dictionary API Error:', response.error)
        return { entries: [], total: 0 }
    }

    const rawData: any[] = Array.isArray(response.data)
        ? response.data
        : (response.data as any).results || (response.data as any).entries || (response.data as any).data || []

    let results: DictionaryEntry[] = rawData.map((raw: any, i: number) => mapRawToEntry(raw, i))

    // Apply local filters since the API seems to just return a list
    const { posFilter = 'all' } = filters

    if (posFilter !== 'all') {
        results = results.filter((entry) => entry.pos === posFilter)
    }

    if (query.trim()) {
        const q = query.trim().toLowerCase()
        results = results.filter((entry) => {
            const searchText = `${entry.word} ${entry.meaning} ${entry.synonyms.join(' ')} ${entry.tags.join(' ')}`.toLowerCase()
            return searchText.includes(q)
        })
    }

    return {
        entries: results,
        total: results.length,
    }
}

export async function getDictionaryEntry(id: number): Promise<DictionaryEntry | null> {
    const all = await getAllDictionaryEntries()
    return all.find(e => e.id === id) || null
}

export async function getAllDictionaryEntries(): Promise<DictionaryEntry[]> {
    const response = await searchDictionary({ limit: 100 } as any)
    return response.entries
}
