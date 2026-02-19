import { NextRequest, NextResponse } from "next/server";

const AUTH_DEBUG = process.env.AUTH_DEBUG === 'true';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        console.log('[API /login] Authenticating user:', email);
        if (AUTH_DEBUG) {
            console.log('[API /login][debug] Request payload:', {
                email,
                hasPassword: !!password,
                passwordLength: typeof password === 'string' ? password.length : 0,
            });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch("http://192.168.1.223:800/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseText = await response.text();
        console.log('[API /login] Backend response:', response.status, responseText);
        if (AUTH_DEBUG) {
            console.log('[API /login][debug] Raw backend response text length:', responseText?.length || 0);
        }

        if (!response.ok) {
            console.error('[API /login] Authentication failed:', response.status, responseText);
            return NextResponse.json(
                { error: `Authentication failed: ${response.status}`, details: responseText },
                { status: response.status }
            );
        }

        try {
            const data = JSON.parse(responseText);
            const resolvedId =
                data.user_id ||
                data.id ||
                data.user?.id ||
                data.data?.user_id ||
                data.data?.id ||
                data.profile?.id ||
                email;

            console.log('[API /login] Login successful, user ID:', resolvedId);
            if (AUTH_DEBUG) {
                console.log('[API /login][debug] Parsed response keys:', Object.keys(data || {}));
                console.log('[API /login][debug] Resolved identity:', {
                    id: resolvedId,
                    email: data.email || email,
                    name: data.name || data.username || email.split('@')[0],
                    hasToken: !!(data.token || data.access_token),
                });
            }

            // Return user data including the backend user ID
            return NextResponse.json({
                success: true,
                id: resolvedId,
                email: data.email || email,
                name: data.name || data.username || email.split('@')[0],
                token: data.token || data.access_token,
                ...data
            });
        } catch (e) {
            return NextResponse.json(
                { error: "Failed to parse backend response as JSON", details: responseText },
                { status: 502 }
            );
        }
    } catch (error: any) {
        console.error("[API /login] Error:", error);

        if (error.name === 'AbortError') {
            return NextResponse.json({
                error: "Request timed out (15s)"
            }, { status: 504 });
        }

        return NextResponse.json(
            { error: `Server error: ${error.message}` },
            { status: 500 }
        );
    }
}
