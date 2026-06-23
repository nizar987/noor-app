export function getUserId(): string {
  if (typeof window === 'undefined') {
    // If called on the server, try to generate a random ID (or handle it via cookies in a server-side context)
    // For our current implementation, we assume getUserId is only called on the client.
    return '';
  }

  const STORAGE_KEY = 'noor-user-id';
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}
