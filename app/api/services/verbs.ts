import type {
    VerbEntry,
    VerbSearchFilters,
    VerbSearchResult,
    ConjugationTable,
    TenseKey,
} from '../types/verbs.types'
import { get } from '../utils/api-client'

import { API_ENDPOINTS, getEndpointUrl } from '../config/endpoints'

function mapRawToVerbEntry(raw: any, index: number): VerbEntry {
    const conjugaisons: any = {}
    const rawConj = raw.conjugaison

    if (rawConj) {
        // Helper to convert object {jewe: "...", ...} to array [{person: "jewe", form: "..."}, ...]
        const toRows = (obj: any) =>
            Object.entries(obj).map(([person, form]) => ({ person, form: String(form) }))

        if (rawConj.kubu) {
            conjugaisons.kubu = { label: 'Indagihe', rows: toRows(rawConj.kubu) }
        }
        if (rawConj["kahise k'imptakivi"]) {
            conjugaisons.kahises = { label: "Kahise k'impitakivi", rows: toRows(rawConj["kahise k'imptakivi"]) }
        }
        if (rawConj["kahise k'indengagihe"]) {
            conjugaisons.Kahise = { label: "Kahise k'indengagihe", rows: toRows(rawConj["kahise k'indengagihe"]) }
        }
        if (rawConj.kazoza) {
            conjugaisons.Kazoza = { label: 'Kazoza', rows: toRows(rawConj.kazoza) }
        }
    }

    return {
        id: index + 1,
        infinitive: raw.infinitif || 'Unknown',
        language: 'Kirundi',
        meaning: raw.insiguro || 'No definition',
        group: raw.categorie || 'Other',
        tags: [raw.indamyi, raw.indantama].filter(Boolean),
        conjugaisons: conjugaisons
    }
}

export async function searchVerbs(
    filters: VerbSearchFilters = {}
): Promise<VerbSearchResult> {
    const { query = '', limit = 100 } = filters as any

    const url = getEndpointUrl('VERBS', API_ENDPOINTS.VERBS.SEARCH)
    const response = await get<any[]>(`${url}?limit=${limit}`)

    if (response.error || !response.data) {
        const errorMsg = typeof response.error === 'string' ? response.error : 'Unknown error'
        console.error('Verbs API Error:', errorMsg)
        return { verbs: [], total: 0 }
    }

    let results = response.data.map(mapRawToVerbEntry)
        .sort((a, b) => a.infinitive.localeCompare(b.infinitive))

    // Apply local query filter if needed
    if (query.trim()) {
        const q = query.trim().toLowerCase()
        results = results.filter((verb: VerbEntry) => {
            return (
                verb.infinitive.toLowerCase().includes(q) ||
                verb.meaning.toLowerCase().includes(q)
            )
        })
    }

    return {
        verbs: results,
        total: results.length,
    }
}

/**
 * Get a specific verb by ID
 */
export async function getVerb(id: number): Promise<VerbEntry | null> {
    const all = await getAllVerbs()
    return all.find((v) => v.id === id) || null
}

/**
 * Get conjugations for a specific verb and tense
 */
export async function getVerbConjugations(
    verbId: number,
    tense: TenseKey
): Promise<ConjugationTable | null> {
    const verb = await getVerb(verbId)
    if (!verb) return null

    return verb.conjugaisons[tense] || null
}

/**
 * Get all verbs
 */
export async function getAllVerbs(): Promise<VerbEntry[]> {
    const response = await searchVerbs({ limit: 100 } as any)
    return response.verbs
}
