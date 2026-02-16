import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    let parsedBody: any = null;
    try {
        const body = await req.json();
        parsedBody = body;
        const { user_id, email, name, password } = body;

        console.log('[API /users] Creating user:', { user_id, email, name });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        // Try to create/register the user in the backend
        const response = await fetch("http://192.168.1.223:800/users/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: user_id,
                email: email,
                name: name || email?.split('@')[0] || 'User',
                ...(password ? { password } : {})
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseText = await response.text();
        console.log('[API /users] Backend response:', response.status, responseText);

        // If user already exists (409 Conflict), that's OK - return the user_id
        if (response.status === 409) {
            return NextResponse.json({
                success: true,
                message: "User already exists",
                id: user_id,
                email: email,
                name: name
            }, { status: 200 });
        }

        // If successful creation (200 or 201)
        if (response.ok) {
            try {
                const data = JSON.parse(responseText);
                return NextResponse.json({
                    success: true,
                    id: data.id || user_id,
                    email: data.email || email,
                    name: data.name || name,
                    ...data
                }, { status: 201 });
            } catch (e) {
                // If response is not JSON, assume success and return the input data
                return NextResponse.json({
                    success: true,
                    id: user_id,
                    email: email,
                    name: name
                }, { status: 201 });
            }
        }

        // If backend error
        return NextResponse.json(
            {
                error: `Backend error: ${response.status}`,
                details: responseText,
                // Still return user data so frontend can proceed
                id: user_id,
                email: email,
                name: name
            },
            { status: response.status }
        );

    } catch (error: any) {
        console.error("[API /users] Error:", error);

        if (error.name === 'AbortError') {
            return NextResponse.json({
                error: "Request timed out (15s)",
                // Return user data from request body
                id: parsedBody?.user_id
            }, { status: 504 });
        }

        return NextResponse.json(
            { error: `Server error: ${error.message}` },
            { status: 500 }
        );
    }
}
