export type ChatCategory = 'Global' | 'Santé' | 'Élevage' | 'Commerce' | 'Agriculture'

export type ChatDomain = 'global' | 'sante' | 'elevage' | 'commerce' | 'agriculture'

export interface ChatMessage {
    id: number
    text: string
    sender: 'user' | 'Rundi AI'
    timestamp: string
    category?: string
}

export interface ChatRequest {
    user_id: string
    session_id: string
    domain: ChatDomain
    message: string
}


export interface ChatResponse {
    answer?: string
    response?: string
    message?: string
}


export interface ChatSessionState {
    chatHistory: ChatMessage[]
    selectedCategory: string
    backendSessionId?: string
}
