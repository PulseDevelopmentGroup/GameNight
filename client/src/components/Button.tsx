import React, { InputHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cx } from "emotion";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className={cx(
        "rounded-lg bg-gray-900 text-gray-500 text-lg px-6 py-1 font-medium",
        rest.className
      )}
    >
      {children}
    </button>
  );
};
