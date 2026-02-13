import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch("http://192.168.1.223:800/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `Backend error: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return NextResponse.json(data);
        } else {
            const text = await response.text();
            try {
                const json = JSON.parse(text);
                return NextResponse.json(json);
            } catch {
                return NextResponse.json({ message: text });
            }
        }
    } catch (error: any) {
        console.error("Proxy error:", error);
        if (error.name === 'AbortError') {
            return NextResponse.json({ error: "Request timed out" }, { status: 504 });
        }
        return NextResponse.json(
            { error: "Server unreachable. Check backend is running." },
            { status: 500 }
        );
    }
}
