export const BASE_URL = "http://localhost:8080";

const joinUrl = (base: string, path: string) =>
  `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

async function request<Response>(method: string, path: string, body?: unknown): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  const res = await fetch(joinUrl(BASE_URL, path), {
    method,
    credentials: "include",
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 204) {
    return null as Response;
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error((data as any)?.error || res.statusText || "Unknown error");
  }

  return data as Response;
}

export const api = {
  get: <TResponse>(path: string) => request<TResponse>("GET", path),
  post: <TBody, TResponse>(path: string, body: TBody) => request<TResponse>("POST", path, body),
  patch: <TBody, TResponse>(path: string, body: TBody) => request<TResponse>("PATCH", path, body),
  delete: <TResponse>(path: string) => request<TResponse>("DELETE", path)
};
