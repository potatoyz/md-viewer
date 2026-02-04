export function isPbAuthError(e: unknown): boolean {
  // PocketBase errors usually carry a status field.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status = (e as any)?.status;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const message = String((e as any)?.message || "");

  // PB may return 404 for protected collections (to avoid leaking existence).
  const looksLikeHiddenByRule =
    status === 404 && message.toLowerCase().includes("missing collection context");

  return status === 401 || status === 403 || looksLikeHiddenByRule;
}
