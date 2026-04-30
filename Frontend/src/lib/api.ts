const DEFAULT_API_BASE = import.meta.env.DEV ? "" : "https://sims-xv2f.onrender.com";

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE;

export async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string }> {
  const rawText = await response.text();

  if (!rawText) {
    return { data: null, rawText };
  }

  try {
    return { data: JSON.parse(rawText) as T, rawText };
  } catch {
    return { data: null, rawText };
  }
}