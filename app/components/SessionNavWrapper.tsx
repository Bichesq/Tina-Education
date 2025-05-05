"use client";

import { useSession } from "next-auth/react";
import HomeNav from "./home_nav";

export default function SessionNavWrapper() {
  const { data: session } = useSession();

  return (
    <HomeNav
      user={
        session ? { name: session.user?.name || "Guest" } : { name: "Guest" }
      }
    />
  );
}
