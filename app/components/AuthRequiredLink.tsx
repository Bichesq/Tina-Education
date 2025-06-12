"use client";

import { useAuthAction } from "../hooks/useAuthAction";
import { ReactNode } from "react";
import Link from "next/link";

interface AuthRequiredLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void | Promise<void>;
  title?: string;
}

/**
 * A link component that requires authentication before navigating.
 * If user is not authenticated, redirects to sign in with current page as callback.
 */
export default function AuthRequiredLink({
  children,
  href,
  className = "",
  style,
  onClick,
  title,
}: AuthRequiredLinkProps) {
  const { executeWithAuth, isAuthenticated } = useAuthAction();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      executeWithAuth(() => {
        // After authentication, the user will be redirected back to current page
        // We can then navigate programmatically or let them click again
        if (onClick) {
          onClick();
        }
      });
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      title={title}
    >
      {children}
    </Link>
  );
}
