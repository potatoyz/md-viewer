import PocketBase from "pocketbase";

export const PB_URL =
  process.env.NEXT_PUBLIC_PB_URL || "https://pb.potatoyz.tech";

// NOTE: This is a singleton client for browser/server usage.
// Auth handling will be added later; for now it can work with public rules
// or an existing login flow.
export const pb = new PocketBase(PB_URL);
