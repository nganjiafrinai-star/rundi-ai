import { NextRequest, NextResponse } from "next/server";

const SESSION_CREATE_URL = "http://192.168.1.223:800/sessions/sessions/";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log('[API /session] Creating session for user:', body.user_id);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        let response = await fetch(SESSION_CREATE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        let responseText = await response.text();
        console.log('[API /session] Backend response:', response.status, responseText);

        // Check for specific "No sessions found" detail from backend
        try {
            if (responseText.includes("No sessions found for user")) {
                const data = JSON.parse(responseText);
                if (data.detail && data.detail.includes("No sessions found")) {
                    // Return empty data structure or similar to indicate fresh start
                    return NextResponse.json({ session_id: null, detail: data.detail });
                }
            }
        } catch (e) {
            // Ignore parse error here, proceed to standard logic
        }

        if (!response.ok) {
            console.error('[API /session] Backend error:', response.status, responseText);
            return NextResponse.json(
                { error: `Backend error: ${response.status} ${responseText}` },
                { status: response.status }
            );
        }

        try {
            const data = JSON.parse(responseText);
            console.log('[API /session] Session created successfully:', data.session_id || data.id);
            return NextResponse.json(data);
        } catch (e) {
            return NextResponse.json(
                { error: "Failed to parse backend response as JSON", details: responseText },
                { status: 502 }
            );
        }
    } catch (error: any) {
        console.error("[API /session] Error:", error);
        if (error.name === 'AbortError') {
            return NextResponse.json({ error: "Request timed out (15s)" }, { status: 504 });
        }
        return NextResponse.json(
            { error: `Server unreachable: ${error.message}` },
            { status: 500 }
        );
    }
}
