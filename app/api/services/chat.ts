import { getEndpointUrl } from '../config/endpoints'
import { ChatDomain, ChatMessage } from '../types/chat.types'

function determineLanguage(domain: ChatDomain, message: string): string {
    const msg = message.toLowerCase()

    if (domain === 'sante') {
        if (['santé', 'médecin', 'médicament', 'maladie', 'hôpital', 'docteur'].some(k => msg.includes(k))) return 'fr'
    } else if (domain === 'elevage') {
        if (['élevage', 'vétérinaire', 'animal', 'bétail', 'vache', 'poule'].some(k => msg.includes(k))) return 'fr'
    } else if (domain === 'agriculture') {
        if (['agriculture', 'culture', 'récolte', 'engrais', 'semence', 'terre'].some(k => msg.includes(k))) return 'fr'
    } else if (domain === 'commerce') {
        if (['commerce', 'marché', 'prix', 'vente', 'achat', 'argent'].some(k => msg.includes(k))) return 'fr'
    }

    if (['jambo', 'habari', 'asante', 'sana', 'wewe', 'mimi', 'hapana', 'ndiyo'].some(k => msg.includes(k))) {
        return 'sw'
    }

    return 'rn'
}

function cleanResponse(text: string): string {
    if (!text) return ''

    let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()

    const loopRegex = /(\b\S+\b)(?:\s+\1){8,}/i
    const loopMatch = cleaned.match(loopRegex)

    if (loopMatch && loopMatch.index !== undefined) {
        return cleaned.substring(0, loopMatch.index).trim() + '...'
    }

    return cleaned
}

export async function sendChatMessage(
    message: string,
    domain: ChatDomain,
    category: string = 'Global',
    sessionId: string = 'a4f013c1-d3ea-4db8-adaa-f93d860893f7',
    userId: string = '28170da6-c67f-4995-9889-d3c0d64e9ff0'
): Promise<string> {
    const url = getEndpointUrl('CHAT', '/chat/')

    const language = determineLanguage(domain, message)
    const payload = {
        message: message,
        domain: domain,
        category: category,
        language: language,
        session_id: sessionId,
        user_id: userId
    }

    console.log('Sending Chat Payload:', payload)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`Server status: ${response.status}`)
        }

        const data = await response.json()
        let answer = ''

        if (data && typeof data === 'object') {
            if (data.answer) {
                answer = data.answer
            } else if (data.reply) {
                answer = data.reply
            } else if (data.message && data.message !== message) {
                answer = data.message
            } else {
                answer = JSON.stringify(data)
            }
        } else if (typeof data === 'string') {
            answer = data
        }

        return cleanResponse(answer)

    } catch (error: any) {
        clearTimeout(timeoutId)
        console.error('Chat API Error:', error)
        return "Server unreachable. Check backend is running and CORS is enabled."
    }
}
export async function regenerateAssistantReply(
    editedMessageId: number,
    newContent: string,
    sessionId: string,
    chatHistory: ChatMessage[],
    domain: ChatDomain,
    category: string,
    userId: string
): Promise<{ assistantMessageId: number; content: string }> {
    const url = getEndpointUrl('CHAT', '/chat/regenerate')

    const payload = {
        edited_message_id: editedMessageId,
        new_content: newContent,
        session_id: sessionId,
        chat_history: chatHistory,
        domain: domain,
        category: category,
        user_id: userId,
        language: determineLanguage(domain, newContent)
    }

    console.log('Regenerating assistant reply with payload:', payload)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`)
        }

        const data = await response.json()
        let answer = data.answer || data.reply || data.message || ''
        answer = cleanResponse(answer)

        return {
            assistantMessageId: data.assistant_message_id || Date.now(),
            content: answer
        }
    } catch (error: any) {
        clearTimeout(timeoutId)
        console.error('Regenerate API Error:', error)
        throw error
    }
}