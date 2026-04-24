import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent" | "outline";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  pill?: boolean;
}

const variantCls: Record<Variant, string> = {
  primary: "bg-ink text-white",
  secondary: "bg-cloud text-ink",
  accent: "bg-accent text-white",
  outline: "bg-white text-ink border-[1.5px] border-ink",
};

const sizeCls: Record<Size, string> = {
  sm: "h-10 text-[14px] px-4",
  md: "h-12 text-[15px] px-5",
  lg: "h-14 text-[16px] px-6",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "lg",
      fullWidth,
      pill,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center font-bold tracking-[-0.3px] transition-colors",
        pill ? "rounded-full" : "rounded-ww-md",
        variantCls[variant],
        sizeCls[size],
        fullWidth && "w-full",
        disabled && "bg-fog text-ash",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  ),
);
Button.displayName = "Button";
