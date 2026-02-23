import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_BACKEND_URL = 'http://192.168.1.223:8005'

export async function GET(request: NextRequest) {
    const city = request.nextUrl.searchParams.get('city')?.trim() || 'Bujumbura'
    const backendUrl = process.env.BACKEND_API_URL || DEFAULT_BACKEND_URL

    try {
        const response = await fetch(
            `${backendUrl}/weather/${encodeURIComponent(city.toLowerCase())}`,
            {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
                cache: 'no-store',
            }
        )

        if (!response.ok) {
            const details = await response.text().catch(() => '')
            return NextResponse.json(
                {
                    error: `Weather backend error: ${response.status}`,
                    details,
                },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json(
            {
                error: 'Weather service unreachable',
                details: error?.message || String(error),
            },
            { status: 500 }
        )
    }
}