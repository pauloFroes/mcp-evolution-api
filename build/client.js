import { BASE_URL, API_KEY, INSTANCE } from "./auth.js";
export class EvolutionApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "EvolutionApiError";
    }
}
export async function apiRequest(endpoint, method = "GET", body, queryParams) {
    let url = `${BASE_URL}${endpoint}`;
    if (queryParams) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined && value !== "") {
                params.set(key, value);
            }
        }
        const qs = params.toString();
        if (qs)
            url += `?${qs}`;
    }
    const response = await fetch(url, {
        method,
        headers: {
            apikey: API_KEY,
            ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 204) {
        return {};
    }
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const msg = error.message ||
            error.error ||
            response.statusText;
        if (response.status === 429) {
            throw new EvolutionApiError(429, "Rate limit exceeded. Try again in a moment.");
        }
        throw new EvolutionApiError(response.status, `Evolution API error (${response.status}): ${msg}`);
    }
    return (await response.json());
}
export function instanceUrl(path) {
    return `/message/${path}/${INSTANCE}`;
}
export function chatUrl(path) {
    return `/chat/${path}/${INSTANCE}`;
}
export function groupUrl(path) {
    return `/group/${path}/${INSTANCE}`;
}
export function instanceBaseUrl(path) {
    return `/instance/${path}/${INSTANCE}`;
}
export function toolResult(data) {
    return {
        content: [
            { type: "text", text: JSON.stringify(data, null, 2) },
        ],
    };
}
export function toolError(message) {
    return {
        isError: true,
        content: [{ type: "text", text: message }],
    };
}
