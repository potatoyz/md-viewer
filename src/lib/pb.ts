import PocketBase from "pocketbase";

export const PB_URL =
  process.env.NEXT_PUBLIC_PB_URL || "https://pb.potatoyz.tech";

export const pb = new PocketBase(PB_URL);

// Persist auth across Next.js navigations/reloads.
// PB uses localStorage in the browser, but cookie sync makes it more robust
// (and later allows server components to read auth if needed).
if (typeof document !== "undefined") {
  try {
    pb.authStore.loadFromCookie(document.cookie);
    pb.authStore.onChange(() => {
      document.cookie = pb.authStore.exportToCookie({
        // non-HttpOnly so client can update it
        httpOnly: false,
        secure: true,
        sameSite: "Lax",
        path: "/",
      });
    });
  } catch {
    // ignore
  }
}
