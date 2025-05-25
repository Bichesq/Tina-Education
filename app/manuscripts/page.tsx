import { SessionProvider } from "next-auth/react";
import Submit from "../components/submit";

export default function Administrator() {
  return (
    <SessionProvider>
      <Submit />
    </SessionProvider>
  );
}
