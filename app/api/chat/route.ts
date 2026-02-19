import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const controller = new AbortController();
    const timeoutMs = 120_000; 
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch("http://192.168.1.223:800/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Backend error: ${response.status}`,
          details: rawText,
        },
        { status: response.status }
      );
    }

    if (contentType.includes("application/json")) {
      try {
        return NextResponse.json(JSON.parse(rawText));
      } catch {
        return NextResponse.json({ message: rawText });
      }
    }

    try {
      return NextResponse.json(JSON.parse(rawText));
    } catch {
      return NextResponse.json({ message: rawText });
    }
  } catch (error: any) {
    console.error("Proxy error:", error);

    if (error?.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. Backend took too long to respond." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        error: "Server unreachable. Check backend is running.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
