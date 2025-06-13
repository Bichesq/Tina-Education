import { prisma } from "../../../prisma";
import UserRoleActions from "./UserRoleActions";
import Image from "next/image";

async function getRecentUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10, // Show latest 10 users
    });

    return users;
  } catch (error) {
    console.error("Failed to fetch recent users:", error);
    return [];
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getRoleInfo(role: string) {
  switch (role) {
    case "ADMIN":
      return {
        label: "Admin",
        color: "bg-red-100 text-red-800",
        icon: "👑",
      };
    case "REVIEWER":
      return {
        label: "Reviewer",
        color: "bg-blue-100 text-blue-800",
        icon: "📖",
      };
    case "USER":
      return {
        label: "User",
        color: "bg-gray-100 text-gray-800",
        icon: "👤",
      };
    default:
      return {
        label: "Unknown",
        color: "bg-gray-100 text-gray-800",
        icon: "❓",
      };
  }
}

export default async function UserManagement() {
  const users = await getRecentUsers();

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Users Found
        </h3>
        <p className="text-gray-500">
          No users have been registered yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => {
        const role = getRoleInfo(user.role);
        
        return (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm">{role.icon}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || "Unnamed User"}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}
                  >
                    {role.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400">
                  Joined {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <UserRoleActions
                userId={user.id}
                currentRole={user.role}
                userName={user.name || user.email}
              />
            </div>
          </div>
        );
      })}

      {/* View All Link */}
      <div className="text-center pt-4 border-t border-gray-200">
        <a
          href="/dashboard/admin/users"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          View All Users →
        </a>
      </div>
    </div>
  );
}
