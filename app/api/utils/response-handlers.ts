import { ApiResponse } from './api-client'


export function unwrapResponse<T>(response: ApiResponse<T>): T {
    if (response.error) {
        throw new Error(response.error)
    }

    if (!response.data) {
        throw new Error('No data returned from API')
    }

    return response.data
}


export function extractField<T, K extends keyof T>(
    response: ApiResponse<T>,
    field: K
): T[K] {
    const data = unwrapResponse(response)
    return data[field]
}


export function extractFirstAvailable<T>(
    data: any,
    fields: string[]
): T | null {
    for (const field of fields) {
        const value = data?.[field]
        if (value !== undefined && value !== null && value !== '') {
            return value as T
        }
    }
    return null
}

export function isSuccess(response: ApiResponse<any>): boolean {
    return !response.error && response.status >= 200 && response.status < 300
}


export function getErrorMessage(response: ApiResponse<any>): string {
    return response.error || 'An unknown error occurred'
}
