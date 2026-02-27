import { BASE_URL, API_KEY, INSTANCE } from "./auth.js";

export class EvolutionApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "EvolutionApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: Record<string, unknown>,
  queryParams?: Record<string, string | undefined>,
): Promise<T> {
  let url = `${BASE_URL}${endpoint}`;

  if (queryParams) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== "") {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
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
    return {} as T;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg =
      (error as Record<string, unknown>).message ||
      (error as Record<string, unknown>).error ||
      response.statusText;

    if (response.status === 429) {
      throw new EvolutionApiError(
        429,
        "Rate limit exceeded. Try again in a moment.",
      );
    }

    throw new EvolutionApiError(
      response.status,
      `Evolution API error (${response.status}): ${msg}`,
    );
  }

  return (await response.json()) as T;
}

export function instanceUrl(path: string): string {
  return `/message/${path}/${INSTANCE}`;
}

export function chatUrl(path: string): string {
  return `/chat/${path}/${INSTANCE}`;
}

export function groupUrl(path: string): string {
  return `/group/${path}/${INSTANCE}`;
}

export function instanceBaseUrl(path: string): string {
  return `/instance/${path}/${INSTANCE}`;
}

export function toolResult(data: unknown) {
  return {
    content: [
      { type: "text" as const, text: JSON.stringify(data, null, 2) },
    ],
  };
}

export function toolError(message: string) {
  return {
    isError: true as const,
    content: [{ type: "text" as const, text: message }],
  };
}
