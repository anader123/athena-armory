export const apiFetcher = async (path: string) => {
  const response = await fetch(`/api/${path}`);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};
