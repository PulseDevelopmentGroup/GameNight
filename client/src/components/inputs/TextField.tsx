import React, { LabelHTMLAttributes, InputHTMLAttributes } from "react";
import { cx } from "emotion";
import { FormContextValues, ValidationOptions } from "react-hook-form";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  register?: FormContextValues["register"];
  validationOptions?: ValidationOptions;
  fullWidth?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  labelProps,
  register,
  validationOptions,
  fullWidth,
  ...rest
}) => {
  return (
    <div>
      <label
        {...labelProps}
        className={cx("block text-gray-800", labelProps?.className)}
      >
        {label}
      </label>
      <input
        type="text"
        ref={validationOptions ? register?.(validationOptions) : register}
        {...rest}
        className={cx(
          "rounded-lg p-2 border-2 border-gray-800 bg-transparent text-gray-500",
          fullWidth && "w-full",
          rest?.className
        )}
      />
    </div>
  );
};
