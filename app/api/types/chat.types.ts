export type ChatCategory = 'Global' | 'Santé' | 'Élevage' | 'Commerce' | 'Agriculture'

export type ChatDomain = 'global' | 'sante' | 'elevage' | 'commerce' | 'agriculture'

export type MessageStatus = 'sent' | 'pending' | 'error'

export interface ChatMessage {
    id: number
    text: string
    sender: 'user' | 'Rundi AI'
    timestamp: string
    category?: string
    // New fields for edit/reply functionality
    parentId?: number | null          // For assistant replies: id of the user message it answers
    editedAt?: number | null          // Timestamp when message was last edited
    status?: MessageStatus            // 'sent', 'pending', or 'error'
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