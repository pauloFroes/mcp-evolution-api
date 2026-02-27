export declare class EvolutionApiError extends Error {
    status: number;
    constructor(status: number, message: string);
}
export declare function apiRequest<T>(endpoint: string, method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", body?: Record<string, unknown>, queryParams?: Record<string, string | undefined>): Promise<T>;
export declare function instanceUrl(path: string): string;
export declare function chatUrl(path: string): string;
export declare function groupUrl(path: string): string;
export declare function instanceBaseUrl(path: string): string;
export declare function toolResult(data: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function toolError(message: string): {
    isError: true;
    content: {
        type: "text";
        text: string;
    }[];
};
