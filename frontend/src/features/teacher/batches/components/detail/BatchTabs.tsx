import React from "react";
import { theme } from "../../../../../../styles/theme";

type Tab = "roster" | "resources" | "attendance";

export const BatchTabs = ({
  activeTab,
  onChange,
}: {
  activeTab: Tab;
  onChange: (t: Tab) => void;
}) => {
  return (
    // Added 'overflow-y-hidden' and inline styles to force hide scrollbars
    <div
      className="w-full overflow-x-auto overflow-y-hidden no-scrollbar mb-6 border-b"
      style={{
        borderColor: theme.colors.border,
        scrollbarWidth: "none", // Hide in Firefox
        msOverflowStyle: "none", // Hide in IE/Edge
      }}
    >
      {/* Hide in WebKit (Chrome/Safari) */}
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      <div className="flex min-w-max">
        {(["roster", "resources", "attendance"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className="px-4 md:px-6 py-3 text-sm font-bold capitalize transition-all border-b-2 whitespace-nowrap"
            style={{
              borderColor:
                activeTab === t ? theme.colors.primary : "transparent",
              color:
                activeTab === t
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              marginBottom: "-1px",
            }}
          >
            {t.replace("-", " ")}
          </button>
        ))}
      </div>
    </div>
  );
};
