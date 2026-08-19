import { useContext } from "react";
import { MdHome, MdPublic, MdSwapHoriz } from "react-icons/md";
import { NetworkContext } from "utils/contexts/network";

export default function NetworkToggle() {
  const { network, setNetwork } = useContext(NetworkContext);

  if (!network) {
    return null;
  }

  const isInternal = network === "internal";

  return (
    <div id="network" className="rounded-full flex items-center self-end gap-1">
      <MdHome
        className={"w-4 h-4 " + (isInternal
            ? "text-theme-800 dark:text-theme-200"
            : "text-theme-400 dark:text-theme-600"
        )}
        title="Internal Network"
      />
      <button
        type="button"
        onClick={() => setNetwork(isInternal ? "external" : "internal")}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-theme-400 focus:ring-offset-2"
        style={{
          backgroundColor: isInternal
            ? "rgb(var(--color-theme-400))"
            : "rgb(var(--color-theme-600))",
        }}
        role="switch"
        aria-checked={isInternal}
        aria-label="Toggle network mode"
      >
        <span className="sr-only">Toggle network mode</span>
        <span
          className={"inline-flex items-center justify-center rounded-full bg-white shadow-sm transition-transform " + (isInternal ? "translate-x-1" : "translate-x-6") + " h-4 w-4"}
        >
          <MdSwapHoriz className="w-3 h-3 text-theme-700" />
        </span>
      </button>
      <MdPublic
        className={"w-4 h-4 " + (!isInternal
            ? "text-theme-800 dark:text-theme-200"
            : "text-theme-400 dark:text-theme-600"
        )}
        title="External Network"
      />
    </div>
  );
}
