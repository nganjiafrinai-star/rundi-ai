
export type PartOfSpeech = 'noun' | 'verb' | 'adj' | 'adv'

export type DictionaryLanguage = 'Kirundi' | 'Français' | 'English'


export interface DictionaryEntry {
    id: number
    word: string
    pos: PartOfSpeech
    rawPos: string
    meaning: string
    examples: string[]
    synonyms: string[]
    expressions: string[]
    tags: string[]
}

export interface DictionarySearchFilters {
    query?: string
    language?: DictionaryLanguage
    posFilter?: 'all' | PartOfSpeech
    onlyFavorites?: boolean
    limit?: number
}

export interface DictionarySearchResult {
    entries: DictionaryEntry[]
    total: number
}

export interface DictionarySessionState {
    query: string
    language: DictionaryLanguage
    posFilter: 'all' | PartOfSpeech
    onlyFavorites: boolean
    selectedId: number
}
