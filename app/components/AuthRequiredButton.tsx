"use client";

import { useAuthAction } from "../hooks/useAuthAction";
import { ReactNode } from "react";

interface AuthRequiredButtonProps {
  children: ReactNode;
  onClick: () => void | Promise<void>;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
}

/**
 * A button component that requires authentication before executing the onClick action.
 * If user is not authenticated, redirects to sign in with current page as callback.
 */
export default function AuthRequiredButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  title,
}: AuthRequiredButtonProps) {
  const { executeWithAuth, isLoading } = useAuthAction();

  const handleClick = () => {
    executeWithAuth(onClick);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={className}
      title={title}
    >
      {children}
    </button>
  );
}
