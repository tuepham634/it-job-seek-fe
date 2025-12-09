

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// fetcher cho SWR – GET API PUBLIC
export const fetcher = (endpoint: string) =>
  fetch(`${API_URL}${endpoint}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network error");
      return res.json();
    });

// fetcher cho SWR – GET API cần cookie (auth)
export const fetcherWithCredentials = (endpoint: string) =>
  fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
  }).then((res) => {
    if (!res.ok) throw new Error("Network error");
    return res.json();
  });
