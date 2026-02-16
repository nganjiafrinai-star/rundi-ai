import { NextRequest, NextResponse } from "next/server";

const BACKEND_REGISTER_URL = "http://192.168.1.223:800/users/users/";

export async function POST(req: NextRequest) {
    let body: any = null;

    try {
        body = await req.json();
        const { email, password, name, user_id } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing required fields: email and password" },
                { status: 400 }
            );
        }

        const generatedUserId =
            user_id ||
            (typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(BACKEND_REGISTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: generatedUserId,
                email,
                password,
                name: name || email.split("@")[0] || "User",
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseText = await response.text();

        if (response.status === 409) {
            return NextResponse.json(
                {
                    success: true,
                    message: "User already exists",
                    id: generatedUserId,
                    email,
                    name: name || email.split("@")[0] || "User",
                },
                { status: 200 }
            );
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: `Backend error: ${response.status}`, details: responseText },
                { status: response.status }
            );
        }

        try {
            const data = JSON.parse(responseText);
            return NextResponse.json(
                {
                    success: true,
                    id: data.id || generatedUserId,
                    email: data.email || email,
                    name: data.name || name || email.split("@")[0] || "User",
                    ...data,
                },
                { status: 201 }
            );
        } catch {
            return NextResponse.json(
                {
                    success: true,
                    id: generatedUserId,
                    email,
                    name: name || email.split("@")[0] || "User",
                },
                { status: 201 }
            );
        }
    } catch (error: any) {
        if (error?.name === "AbortError") {
            return NextResponse.json(
                { error: "Request timed out (15s)", id: body?.user_id },
                { status: 504 }
            );
        }

        return NextResponse.json(
            { error: `Server error: ${error?.message || "Unknown error"}` },
            { status: 500 }
        );
    }
}
