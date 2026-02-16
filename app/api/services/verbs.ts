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
  const conjugaisons: Partial<Record<TenseKey, ConjugationTable>> = {}
  const rawConj = raw?.conjugaison || {}

  const toRows = (obj: any) =>
    Object.entries(obj ?? {}).map(([person, form]) => ({
      person: String(person),
      form: String(form),
    }))

  // Present tense mapping
  const presentData = rawConj.kubu || rawConj.indagihe || rawConj.Indagihe
  if (presentData) {
    conjugaisons.kubu = {
      label: 'Kubu',
      rows: toRows(presentData)
    }
  }

  // Past Perfective mapping (Kahise k'impitakivi)
  const pastPerfectiveData =
    rawConj["kahise k'impitakivi"] ||
    rawConj["kahise k'imptakivi"] ||
    rawConj.kahises

  if (pastPerfectiveData) {
    conjugaisons.kahises = {
      label: "Kahise k'impitakivi",
      rows: toRows(pastPerfectiveData),
    }
  }

  // Past Indeterminate mapping (Kahise k'indengagihe)
  const pastIndeterminateData =
    rawConj["kahise k'indengagihe"] ||
    rawConj.Kahise

  if (pastIndeterminateData) {
    conjugaisons.Kahise = {
      label: "Kahise k'indengagihe",
      rows: toRows(pastIndeterminateData),
    }
  }

  // Future mapping
  const futureData = rawConj.kazoza || rawConj.Kazoza
  if (futureData) {
    conjugaisons.Kazoza = {
      label: 'Kazoza',
      rows: toRows(futureData)
    }
  }

  return {
    id: raw?.id || index + 1,
    infinitive: raw?.infinitif || raw?.infinitive || 'Unknown',
    language: 'Kirundi',
    meaning: raw?.insiguro || raw?.meaning || 'No definition',
    group: raw?.categorie || raw?.group || 'Other',
    tags: [raw?.indamyi, raw?.indantama].filter(Boolean),
    conjugaisons: conjugaisons as any,
  }
}

export async function searchVerbs(
  filters: VerbSearchFilters = {}
): Promise<VerbSearchResult> {
  const { query = '', limit = 100 } = filters

  const baseUrl = getEndpointUrl('VERBS', API_ENDPOINTS.VERBS.SEARCH)
  const trimmedQuery = query.trim().toLowerCase()

  const requestUrl = trimmedQuery
    ? `${baseUrl}/${encodeURIComponent(trimmedQuery)}`
    : `${baseUrl}?limit=${encodeURIComponent(String(limit))}`

  let response: { data?: any; error?: unknown }
  try {
    response = await get<any>(requestUrl)
  } catch (err) {
    console.error('Verb API error:', err)
    return { verbs: [], total: 0 }
  }

  if (response?.error || response?.data == null) {
    return { verbs: [], total: 0 }
  }

  let rawData: any[]
  if (trimmedQuery) {
    rawData = Array.isArray(response.data)
      ? response.data
      : response.data
        ? [response.data]
        : []
  } else {
    rawData = Array.isArray(response.data)
      ? response.data
      : response.data.results || response.data.verbs || response.data.data || []
  }

  const results = rawData
    .map((raw: any, i: number) => mapRawToVerbEntry(raw, i))
    .sort((a: VerbEntry, b: VerbEntry) => a.infinitive.localeCompare(b.infinitive))

  return {
    verbs: results,
    total: results.length,
  }
}

export async function getVerb(id: number): Promise<VerbEntry | null> {
  const all = await getAllVerbs()
  return all.find((v) => v.id === id) || null
}


export async function getVerbConjugations(
  verbId: number,
  tense: TenseKey
): Promise<ConjugationTable | null> {
  const verb = await getVerb(verbId)
  if (!verb) return null
  return verb.conjugaisons?.[tense] || null
}


export async function getAllVerbs(): Promise<VerbEntry[]> {
  const response = await searchVerbs({ limit: 100 } as any)
  return response.verbs
}
