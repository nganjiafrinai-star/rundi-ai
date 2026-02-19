export type ChatCategory = 'Global' | 'Santé' | 'Élevage' | 'Commerce' | 'Agriculture'

export type ChatDomain = 'global' | 'sante' | 'elevage' | 'commerce' | 'agriculture'

export type MessageStatus = 'sent' | 'pending' | 'error'

export interface ChatMessage {
    id: number
    text: string
    sender: 'user' | 'Rundi AI'
    timestamp: string
    category?: string
    parentId?: number | null     
    editedAt?: number | null          
    status?: MessageStatus            
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

export interface RegenerateRequest {
    edited_message_id: number
    new_content: string
    session_id: string
    chat_history: ChatMessage[]
    domain: ChatDomain
    category: string
    user_id: string
    language: string
}

export interface RegenerateResponse {
    assistant_message_id: number
    content: string
}

export interface ChatSessionState {
    chatHistory: ChatMessage[]
    selectedCategory: string
    backendSessionId?: string
}