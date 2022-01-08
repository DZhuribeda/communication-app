import React from "react";
import classNames from "classnames";
import NextLink from "next/link";
import { Size } from "../general";

export enum LinkAction {
  DEFAULT,
  GRAY,
}

type LinkProps = {
  size: Size;
  href: string;
  action?: LinkAction;
  disabled?: boolean;
};

export const Link: React.FC<LinkProps> = ({
  children,
  href,
  size,
  action = LinkAction.DEFAULT,
  disabled = false,
}) => {
  const sizeClass = {
    [Size.sm]: "text-sm",
    [Size.md]: "text-sm",
    [Size.lg]: "text-md",
    [Size.xl]: "text-md",
    [Size.xxl]: "text-md",
  };
  const colorClass = {
    [LinkAction.DEFAULT]: "p-0 text-primary-700",
    [LinkAction.GRAY]: "p-0 text-gray-500",
  };
  return (
    <NextLink href={href} passHref>
      <a
        className={classNames(
          "w-full rounded-lg font-medium",
          sizeClass[size],
          colorClass[action],
          {
            "cursor-not-allowed text-gray-300 pointer-events-none": disabled,
          }
        )}
      >
        {children}
      </a>
    </NextLink>
  );
};
