"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthSect() {
    const { data: session } = useSession();
    return (
        <div className="flex justify-center items-center gap-5 relative text-gray-500">
        {!session && (
            <>
            <button
                className="px-5 py-2 border border-black rounded text-gray-800 hover:bg-black hover:text-white hover:bg-opacity-10 transition-colors"
                onClick={() =>
                signIn(undefined, { callbackUrl: "/dashboard" })
                }
            >
                Sign In
            </button>
            <button className="px-5 py-2 border border-white rounded bg-blue-900 text-white hover:bg-black">
                Sign up
            </button>
            </>
        )}
        {session && (
            <>
            <span className="text-gray-800 font-medium">{session.user?.name}</span>
            <button
                className="px-5 py-2 border border-white rounded bg-blue-900 text-white hover:bg-black"
                onClick={() => signOut({ callbackUrl: "/" })}
            >
                Sign out
            </button>
            </>
        )}
        </div>
    );
    }