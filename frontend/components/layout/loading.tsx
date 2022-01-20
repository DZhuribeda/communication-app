import React from "react";

export function Loading() {
  return (
    <div className="flex h-80 flex-col items-center justify-center text-center">
      <div
        className="w-12 h-12 border-4 border-primary-600 rounded-full animate-spin"
        style={{ borderRightColor: "transparent" }}
      ></div>
      <div className="text-xl pt-4">Loading</div>
    </div>
  );
}
