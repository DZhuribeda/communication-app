import React from "react";
import { Navigation } from "./navigation";

type LayoutProps = {
  title: string;
};

export function Layout({
  children,
  title,
}: React.PropsWithChildren<LayoutProps>) {
  return (
    <div className="min-h-full">
      <Navigation />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 table:px-6 desktop:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 table:px-6 desktop:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
