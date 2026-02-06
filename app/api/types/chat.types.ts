/**
 * Chat API types
 */

export type ChatCategory = 'Global' | 'Santé' | 'Élevage' | 'Commerce' | 'Agriculture'

export type ChatDomain = 'globale' | 'sante' | 'elevage' | 'commerce' | 'agriculture'

/**
 * Chat message structure
 */
export interface ChatMessage {
    id: number
    text: string
    sender: 'user' | 'Rundi AI'
    timestamp: string
    category?: string
}

/**
 * Chat request payload
 */
export interface ChatRequest {
    user_id: string
    session_id: string
    domain: ChatDomain
    message: string
}

/**
 * Chat response from API
 */
export interface ChatResponse {
    answer?: string
    response?: string
    message?: string
}

/**
 * Chat session state
 */
export interface ChatSessionState {
    chatHistory: ChatMessage[]
    selectedCategory: string
}
