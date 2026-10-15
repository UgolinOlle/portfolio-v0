import { GITHUB_REPO } from '~/lib/constants';

const DAY = 86_400;

// Server-only: cached for a day, `null` when the API is unreachable or rate-limited.
export async function getStarCount() {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      next: { revalidate: DAY },
    });
    if (!res.ok) return null;
    const json: { stargazers_count?: number } = await res.json();
    return json.stargazers_count ?? null;
  } catch {
    return null;
  }
}
