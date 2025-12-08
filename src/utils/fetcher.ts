export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const fetcherWithCredentials = (url: string) => 
  fetch(url, { credentials: "include" }).then((res) => res.json());
