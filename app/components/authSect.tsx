"use client";
import { signIn, useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { NotificationBell } from "./NotificationBell";
import UserDropdown from "./UserDropdown";

export default function AuthSect() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getCurrentUrl = () => {
    const params = searchParams.toString();
    return params ? `${pathname}?${params}` : pathname;
  };

  return (
    <div className="flex justify-center items-center gap-5 relative text-gray-400">
      {!session && (
        <>
          <button
            className="px-5 py-2 border border-black rounded text-gray-800 hover:bg-black hover:text-white hover:bg-opacity-10 transition-colors"
            onClick={() => signIn(undefined, { callbackUrl: getCurrentUrl() })}
          >
            Sign In
          </button>
        </>
      )}
      {session && (
        <>
          <NotificationBell />
          <UserDropdown user={session.user} />
        </>
      )}
    </div>
  );
}