// =============================================================
// Wix Headless Client — Maqte Colombia (SPA / Vite)
//
// Uses OAuthStrategy with public Client ID (no API Key needed).
// Token persistence in localStorage so the cart survives page
// refreshes and navigation.
//
// Adapted from the Restomueble wixContext pattern but simplified
// for a client-side only SPA (no server-side rendering).
// =============================================================

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { redirects } from "@wix/redirects";

const WIX_CLIENT_ID = import.meta.env.VITE_WIX_CLIENT_ID || "";
const TOKEN_KEY = "maqte_wix_session";

// ─── Token Storage ───────────────────────────────────────
function createTokenStorage() {
  return {
    getTokens() {
      try {
        const raw = localStorage.getItem(TOKEN_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
            return parsed;
          }
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
      // Return empty tokens structure — the SDK will generate new ones
      return {
        accessToken: { value: "", expiresAt: 0 },
        refreshToken: { value: "", role: "" },
      };
    },
    setTokens(tokens) {
      try {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      } catch {
        // localStorage may be full or unavailable
      }
    },
  };
}

// ─── Create Client ───────────────────────────────────────
export function createWixClient() {
  return createClient({
    modules: {
      products,
      collections,
      currentCart,
      redirects,
    },
    auth: OAuthStrategy({
      clientId: WIX_CLIENT_ID,
      tokenStorage: createTokenStorage(),
    }),
  });
}

// ─── Constants ───────────────────────────────────────────
// Wix Stores App ID — universal constant for addToCart
export const WIX_STORES_APP_ID = "1380b703-ce81-ff05-f115-39571d94dfcd";
