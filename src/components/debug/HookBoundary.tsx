import React from "react";

export function HookBoundary({ children }: { children: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (err) {
    console.error("HookBoundary caught error:", err);
    return (
      <div className="p-6 text-red-600">
        <h2>Hook error in a provider</h2>
        <pre>{String(err)}</pre>
      </div>
    );
  }
}