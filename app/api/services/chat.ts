import { post } from '../utils/api-client'
import { getEndpointUrl, API_TIMEOUTS } from '../config/endpoints'
import { extractFirstAvailable } from '../utils/response-handlers'
import type {
    ChatCategory,
    ChatDomain,
    ChatRequest,
    ChatResponse,
    ChatMessage,
} from '../types/chat.types'


export function categoryToDomain(category: string): ChatDomain {
    const mapping: Record<string, ChatDomain> = {
        'Global': 'globale',
        'Santé': 'sante',
        'Élevage': 'elevage',
        'Commerce': 'commerce',
        'Agriculture': 'agriculture',
        'Rusangi': 'globale',
        'Ubuzima': 'sante',
        'Ubworozi': 'elevage',
        'Ubucuruzi': 'commerce',
        'Ubuhinzi': 'agriculture',
    }

    return mapping[category] || 'globale'
}


export async function sendChatMessage(
    message: string,
    category: string,
    userId: string = '9c27e379-9000-46b3-beaf-ab8a1d558575',
    sessionId: string = 'fab3e03a-73c8-480d-80e6-8cfe4ea21264'
): Promise<string> {
    if (!message.trim()) {
        throw new Error('Message cannot be empty')
    }

    const url = getEndpointUrl('CHAT', '/chat/')

    const requestBody: ChatRequest = {
        user_id: userId,
        session_id: sessionId,
        domain: categoryToDomain(category),
        message: message.trim(),
    }

    const response = await post<ChatResponse>(url, requestBody, {
        timeout: API_TIMEOUTS.CHAT,
        headers: {
            'accept': 'application/json',
        },
    })

    if (response.error) {
        throw new Error(response.error)
    }
    const answer = extractFirstAvailable<string>(response.data, [
        'answer',
        'response',
        'message',
    ])

    if (!answer || !answer.trim()) {
        return 'No answer returned by API.'
    }

    return answer
}

export function getChatTimestamp(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function createChatMessage(
    text: string,
    sender: 'user' | 'Rundi AI',
    category?: string
): ChatMessage {
    return {
        id: Date.now(),
        text,
        sender,
        timestamp: getChatTimestamp(),
        category,
    }
}
