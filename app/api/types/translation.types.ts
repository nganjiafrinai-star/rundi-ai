

export type Language = 'Français' | 'English' | 'Kirundi' | 'Swahili'

export type ApiLanguageCode = 'K' | 'E' | 'F' | 'S'


export interface TranslationRequest {
    text: string
    direction: string 
}


export interface TranslationResponse {
    translation?: string
    translated_text?: string
    translatedText?: string
    result?: string
    data?: {
        translation?: string
    }
}

export interface TranslationResult {
    text: string
    from: Language
    to: Language
}
