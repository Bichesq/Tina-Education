"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  href: string;
  icon: string;
  label: string;
}

function SidebarItem({ href, icon, label }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <li className="mb-1">
      <Link
        href={href}
        className={`flex items-center px-5 py-3 text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-900 hover:border-l-3 hover:border-blue-900 transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-900 border-l-3 border-blue-900"
            : ""
        }`}
      >
        <span className="mr-3 text-lg">{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed w-64 bg-white shadow-md h-[calc(100vh-3rem)] overflow-y-auto">
      <div className="py-5">
        <ul>
          <SidebarItem href="/dashboard" icon="📊" label="Dashboard" />
          <SidebarItem href="/dashboard/publications" icon="📚" label="My Publications" />
          <SidebarItem href="/dashboard/manuscripts" icon="📝" label="Manuscripts" />
          <SidebarItem href="/dashboard/reviews" icon="📋" label="Reviews" />
          <SidebarItem href="/dashboard/analytics" icon="📈" label="Analytics" />
        </ul>

        <div className="mt-5 pt-5 border-t border-gray-200">
          <h3 className="px-5 mb-4 text-gray-500 text-sm uppercase">
            Collaboration
          </h3>
          <ul>
            <SidebarItem href="/dashboard/collaborators" icon="👥" label="Co-authors" />
            <SidebarItem href="/dashboard/messages" icon="💬" label="Messages" />
            <SidebarItem href="/dashboard/notifications" icon="🔔" label="Notifications" />
          </ul>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-200">
          <h3 className="px-5 mb-4 text-gray-500 text-sm uppercase">
            Resources
          </h3>
          <ul>
            <SidebarItem href="/dashboard/library" icon="📕" label="My Library" />
            <SidebarItem href="/dashboard/tools" icon="🧰" label="Writing Tools" />
            <SidebarItem href="/dashboard/calendar" icon="📅" label="Calendar" />
            <SidebarItem href="/dashboard/settings" icon="⚙️" label="Settings" />
          </ul>
        </div>
      </div>
    </aside>
  );
}
