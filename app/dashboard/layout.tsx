import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "../components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex pt-15 min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
