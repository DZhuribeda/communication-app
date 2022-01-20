import React from "react";
import { Navigation } from "./navigation";

type LayoutProps = {
  title: string;
  actions?: React.ReactNode;
};

export function Layout({
  children,
  title,
  actions,
}: React.PropsWithChildren<LayoutProps>) {
  return (
    <div className="min-h-full">
      <Navigation />
      <header className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 table:px-6 desktop:px-8 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {actions && <div>{actions}</div>}
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto table:px-6 desktop:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
