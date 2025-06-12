import Sidebar from "../components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication is handled by middleware

  return (
    <div className="bg-gray-100 pt-20">
      <div className="flex min-h-[calc(100vh-5rem)]">
        <Sidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
