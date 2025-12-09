/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const request = async (
  endpoint: string,
  method: string = "GET",
  data?: any,
  extraHeaders: Record<string, string> = {}
) => {
  const url = `${API_URL}${endpoint}`;

  let headers: Record<string, string> = {
    ...extraHeaders,
  };

  let options: RequestInit = {
    method,
    credentials: "include", 
    headers,
  };


  if (data !== undefined) {
    if (data instanceof FormData) {
      options.body = data;
      delete headers["Content-Type"];
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const errorText = await res.text().catch(() => "Unknown error");
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const api = {
  get: (endpoint: string) => request(endpoint, "GET"),
  post: (endpoint: string, body?: any) => request(endpoint, "POST", body),
  patch: (endpoint: string, body?: any) => request(endpoint, "PATCH", body),
  delete: (endpoint: string, body?: any) => request(endpoint, "DELETE", body),
};
