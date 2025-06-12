"use client";

import { useSession, signIn } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Custom hook for handling actions that require authentication
 * If user is not authenticated, redirects to sign in with current page as callback
 */
export function useAuthAction() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getCurrentUrl = () => {
    const params = searchParams.toString();
    return params ? `${pathname}?${params}` : pathname;
  };

  const executeWithAuth = async (action: () => void | Promise<void>) => {
    if (status === "loading") {
      return; // Wait for session to load
    }

    if (!session?.user?.id) {
      // User is not authenticated, redirect to sign in with current page as callback
      const currentUrl = getCurrentUrl();
      await signIn(undefined, { 
        callbackUrl: currentUrl 
      });
      return;
    }

    // User is authenticated, execute the action
    await action();
  };

  const isAuthenticated = !!session?.user?.id;
  const isLoading = status === "loading";

  return {
    executeWithAuth,
    isAuthenticated,
    isLoading,
    session,
  };
}
