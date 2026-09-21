import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "text";
type Size = "md" | "lg";

export type __Name__Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-medium " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-go-700 text-white hover:bg-go-700/90",
  secondary: "border border-line bg-white text-ink hover:bg-band",
  text: "text-brand-700 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-6 text-lg",
};

export const __Name__ = forwardRef<HTMLButtonElement, __Name__Props>(
  function __Name__(
    { variant = "primary", size = "md", className = "", type = "button", ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={[base, variants[variant], sizes[size], className].join(" ")}
        {...rest}
      />
    );
  }
);
