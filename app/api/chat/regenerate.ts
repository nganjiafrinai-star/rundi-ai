import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage, RegenerateRequest } from '@/app/api/types/chat.types'

export async function POST(request: NextRequest) {
    try {
        const body: RegenerateRequest = await request.json()

        const {
            edited_message_id,
            new_content,
            session_id,
            chat_history,
            domain,
            category,
            user_id,
            language,
        } = body

        // Step 1: Find the edited message
        const editedMsgIndex = chat_history.findIndex((msg) => msg.id === edited_message_id)

        if (editedMsgIndex === -1) {
            return NextResponse.json(
                { error: 'Edited message not found in history' },
                { status: 400 }
            )
        }

        const editedMsg = chat_history[editedMsgIndex]

        if (editedMsg.sender !== 'user') {
            return NextResponse.json(
                { error: 'Can only edit user messages' },
                { status: 400 }
            )
        }

        // Step 2: Build context with edited message (remove all messages after it)
        const contextMessages: ChatMessage[] = [
            ...chat_history.slice(0, editedMsgIndex),
            {
                ...editedMsg,
                text: new_content,
            },
        ]

        // Step 3: Build prompt from context
        const promptParts: string[] = contextMessages.map((msg) => {
            const speaker = msg.sender === 'user' ? 'User' : 'Assistant'
            return `${speaker}: ${msg.text}`
        })

        const prompt = promptParts.join('\n\n') + '\n\nAssistant:'

        // Step 4: Call your backend LLM service
        // Replace this with your actual backend call
        const backendUrl = process.env.BACKEND_API_URL || 'http://192.168.1.223:8005'
        
        const llmPayload = {
            message: new_content,
            domain: domain,
            category: category,
            language: language,
            user_id: user_id,
            session_id: session_id,
            prompt: prompt, // Send full context if your backend supports it
        }

        const llmResponse = await fetch(`${backendUrl}/chat/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(llmPayload),
        })

        if (!llmResponse.ok) {
            throw new Error(`Backend LLM error: ${llmResponse.status}`)
        }

        const llmData = await llmResponse.json()
        let answer = llmData.answer || llmData.reply || llmData.message || ''

        // Clean response (remove think tags, etc.)
        answer = answer.replace(/<(think|thought|regex)>[\s\S]*?<\/\1>/gi, '').trim()

        // Step 5: Return the new reply
        return NextResponse.json({
            assistant_message_id: Date.now(),
            content: answer,
        })
    } catch (error) {
        console.error('Regenerate error:', error)
        return NextResponse.json(
            {
                error: `Failed to regenerate reply: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
            { status: 500 }
        )
    }
}