import React from 'react';
import classNames from "classnames";
import { Size } from "../general";

export enum ButtonAction {
  PRIMARY,
  SECONDARY,
  SECONDARY_GRAY,
  TERTIARY,
  TERTIARY_GRAY,
  LINK,
  LINK_GRAY,
}

type ButtonProps = {
  size: Size;
  name: string;
  value?: string;
  type?: "button" | "submit" | "reset";
  action?: ButtonAction;
  disabled?: boolean;
};

// eslint-disable-next-line react/display-name
export const Button = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps>>(({
  children,
  size,
  name,
  value,
  action = ButtonAction.PRIMARY,
  type = "button",
  disabled = false,
}, ref) => {
  const sizeClass = {
    [Size.sm]: "py-2 px-3 text-sm",
    [Size.md]: "py-3 px-4 text-sm",
    [Size.lg]: "py-3 px-4 text-md",
    [Size.xl]: "py-4 px-5 text-md",
    [Size.xxl]: "py-5 px-6 text-md",
  };
  const colorClass = {
    [ButtonAction.PRIMARY]:
      "shadow-xs text-white bg-primary-600 border border-primary-600 hover:bg-primary-700 hover:border-primary-700 focus:outline-none focus:shadow-focus disabled:bg-primary-200 disabled:border-primary-200",
    [ButtonAction.SECONDARY]:
      "shadow-xs text-primary-700 bg-primary-50 border border-primary-50 hover:bg-primary-100 hover:border-primary-100 focus:outline-none focus:shadow-focus disabled:bg-primary-200 disabled:text-primary-300 disabled:border-primary-200",
    [ButtonAction.SECONDARY_GRAY]:
      "shadow-xs text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:shadow-focus focus:shadow-gray-100 disabled:bg-primary-25 disabled:text-gray-300 disabled:border-gray-200",
    [ButtonAction.TERTIARY]:
      "text-primary-700 bg-white hover:bg-primary-50 disabled:text-gray-300",
    [ButtonAction.TERTIARY_GRAY]:
      "text-gray-500 bg-white hover:bg-gray-50 disabled:text-gray-300",
    [ButtonAction.LINK]: "p-0 text-primary-700 bg-white disabled:text-gray-300",
    [ButtonAction.LINK_GRAY]:
      "p-0 text-gray-500 bg-white disabled:text-gray-300",
  };
  return (
    <button
      ref={ref}
      name={name}
      value={value}
      type={type}
      disabled={disabled}
      className={classNames("w-full rounded-lg font-medium", sizeClass[size], colorClass[action])}
    >
      {children}
    </button>
  );
});
