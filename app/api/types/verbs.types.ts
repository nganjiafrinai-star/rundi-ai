
export type TenseKey = 'kubu' | 'kahises' | 'Kahise' | 'Kazoza'

export type VerbLanguage = 'Kirundi'

export interface ConjugationRow {
    person: string
    form: string
}

export interface ConjugationTable {
    label: string
    rows: ConjugationRow[]
}

export type Conjugations = {
    [key in TenseKey]?: ConjugationTable
} & {
    [key: string]: ConjugationTable | undefined
}

export interface VerbEntry {
    id: number
    infinitive: string
    language: VerbLanguage
    meaning: string
    group?: string
    tags: string[]
    conjugaisons: Conjugations
}


export interface VerbSearchFilters {
    query?: string
    language?: VerbLanguage
    onlyFavorites?: boolean
}


export interface VerbSearchResult {
    verbs: VerbEntry[]
    total: number
}


export interface VerbSessionState {
    query: string
    language: VerbLanguage
    tense: string
    selectedId: number
    onlyFavorites: boolean
}
