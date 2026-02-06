/**
 * Base API client with error handling and common configurations
 */

export interface ApiClientOptions {
    timeout?: number
    headers?: Record<string, string>
}

export interface ApiResponse<T> {
    data?: T
    error?: string
    status: number
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

/**
 * Base fetch wrapper with timeout and error handling
 */
export async function apiClient<T = any>(
    url: string,
    options: RequestInit & ApiClientOptions = {}
): Promise<ApiResponse<T>> {
    const { timeout = 30000, headers = {}, ...fetchOptions } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const errorText = await response.text().catch(() => '')
            throw new ApiError(
                errorText || `Request failed with status ${response.status}`,
                response.status,
                errorText
            )
        }

        const data = await response.json().catch(() => null)

        return {
            data,
            status: response.status,
        }
    } catch (error: any) {
        clearTimeout(timeoutId)

        if (error.name === 'AbortError') {
            return {
                error: 'Request timeout. Please try again.',
                status: 408,
            }
        }

        if (error instanceof ApiError) {
            return {
                error: error.message,
                status: error.status,
            }
        }

        return {
            error: error?.message || 'Network error. Please check your connection.',
            status: 0,
        }
    }
}

/**
 * GET request helper
 */
export async function get<T = any>(
    url: string,
    options?: ApiClientOptions
): Promise<ApiResponse<T>> {
    return apiClient<T>(url, { ...options, method: 'GET' })
}

/**
 * POST request helper
 */
export async function post<T = any>(
    url: string,
    body?: any,
    options?: ApiClientOptions
): Promise<ApiResponse<T>> {
    return apiClient<T>(url, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
    })
}

/**
 * PUT request helper
 */
export async function put<T = any>(
    url: string,
    body?: any,
    options?: ApiClientOptions
): Promise<ApiResponse<T>> {
    return apiClient<T>(url, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
    })
}

/**
 * DELETE request helper
 */
export async function del<T = any>(
    url: string,
    options?: ApiClientOptions
): Promise<ApiResponse<T>> {
    return apiClient<T>(url, { ...options, method: 'DELETE' })
}
