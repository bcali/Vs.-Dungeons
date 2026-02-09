import React from "react";
import { cn } from "../../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "action" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-accent-gold text-bg-page hover:opacity-80 font-bold disabled:opacity-50",
      action: "bg-accent-red text-white hover:opacity-80 font-bold disabled:opacity-40",
      secondary: "bg-bg-input text-text-secondary hover:text-white transition-colors",
      ghost: "bg-transparent hover:bg-bg-input text-text-secondary hover:text-white transition-colors",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs radius-sm",
      md: "h-10 px-4 py-2 radius-sm",
      lg: "h-12 px-6 radius-md text-lg",
      icon: "h-7 w-7 p-0 flex items-center justify-center radius-sm text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <span className="animate-pulse">...</span> : children}
      </button>
    );
  }
);

Button.displayName = "Button";
