import { createContext, useCallback, useEffect, useMemo, useState } from "react";

/**
 * Checks if a hostname is on a private/internal network.
 * Returns true for localhost, private IP ranges, and "home.arpa" / "internal" domains.
 */
function isInternalHost(hostname) {
  if (!hostname) return false;

  const lower = hostname.toLowerCase();

  // Localhost
  if (lower === "localhost" || lower === "127.0.0.1" || lower === "::1" || lower === "[::1]") {
    return true;
  }

  // Private IPv4 ranges
  // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
  if (
    lower.startsWith("10.") ||
    lower.startsWith("192.168.") ||
    lower.startsWith("172.") ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal") ||
    lower.endsWith(".home.arpa")
  ) {
    // Check 172.16.0.0/12 more carefully
    if (lower.startsWith("172.")) {
      const parts = lower.split(".");
      if (parts.length >= 2) {
        const second = parseInt(parts[1], 10);
        if (second >= 16 && second <= 31) {
          return true;
        }
        // Also treat 172.x.x.x without a domain as internal (common in enterprise)
        if (parts.length > 1 && !lower.includes(".")) return true;
        return false;
      }
    }
    return true;
  }

  // Treat any bare IP as internal (common in homelab setups)
  const ipv4Pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipv4Pattern.test(lower)) {
    return true;
  }

  return false;
}

function getInitialNetwork() {
  // First check localStorage for user override
  if (typeof window !== "undefined" && window.localStorage) {
    const stored = window.localStorage.getItem("network-mode");
    if (stored === "internal" || stored === "external") {
      return stored;
    }
  }

  // Auto-detect from the hostname
  if (typeof window !== "undefined") {
    return isInternalHost(window.location.hostname) ? "internal" : "external";
  }

  return "internal"; // SSR default
}

export const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const [network, setNetwork] = useState(() => getInitialNetwork());

  const setNetworkMode = useCallback((mode) => {
    if (mode === "internal" || mode === "external") {
      setNetwork(mode);
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("network-mode", mode);
      }
    }
  }, []);

  // Re-detect when the page loads (for SSR)
  useEffect(() => {
    const detected = getInitialNetwork();
    setNetwork(detected);
  }, []);

  const value = useMemo(() => ({ network, setNetwork: setNetworkMode }), [network, setNetworkMode]);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}
