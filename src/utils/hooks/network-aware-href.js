import { useContext, useCallback } from "react";
import { NetworkContext } from "utils/contexts/network";

/**
 * Hook that returns a function to resolve network-aware hrefs.
 * If a service/bookmark has both internalHref and externalHref,
 * the appropriate one is used based on the current network mode.
 * Falls back to the regular href field.
 */
export function useNetworkAwareHref() {
  const { network } = useContext(NetworkContext);

  const resolveHref = useCallback(
    (item) => {
      if (!item) return "#";

      // If the item has network-specific hrefs, use the current mode
      if (item.internalHref || item.externalHref) {
        return network === "internal" && item.internalHref
          ? item.internalHref
          : item.externalHref || item.href || "#";
      }

      // Fall back to the regular href
      return item.href || "#";
    },
    [network],
  );

  return { resolveHref, network };
}
