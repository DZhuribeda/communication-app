import React from "react";

type EmptyProps = {
  message: string;
};

export function Empty({ message }: EmptyProps) {
  return (
    <div className="flex h-80 flex-col items-center justify-center text-center">
      <div className="text-xl">{message}</div>
    </div>
  );
}
