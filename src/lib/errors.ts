export function isPbAuthError(e: unknown): boolean {
  // PocketBase errors usually carry a status field.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const status = (e as any)?.status;
  return status === 401 || status === 403;
}
