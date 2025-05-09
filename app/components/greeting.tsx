"use client";
import { useSession } from "next-auth/react";

export default function Greeting() {
  const { data: session } = useSession();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome back {session?.user?.name}
      </h1>
    </div>
  );
}