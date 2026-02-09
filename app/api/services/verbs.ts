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

  const url = getEndpointUrl('VERBS', API_ENDPOINTS.VERBS.SEARCH)

  let response: { data?: any; error?: unknown }
  try {
    response = await get<any>(`${url}?limit=${encodeURIComponent(String(limit))}`)
  } catch {
    return { verbs: [], total: 0 }
  }

  if (response?.error || !response?.data) {
    return { verbs: [], total: 0 }
  }

  const rawData = Array.isArray(response.data)
    ? response.data
    : response.data.results || response.data.verbs || response.data.data || []

  let results = rawData
    .map((raw: any, i: number) => mapRawToVerbEntry(raw, i))
    .sort((a: VerbEntry, b: VerbEntry) => a.infinitive.localeCompare(b.infinitive))

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
    total: response.data.total || results.length 
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
