import Link from "next/link";

interface StatsCardProps {
  icon: string;
  title?: string;
  label?: string;
  value: number | string;
  color?: string;
  href?: string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({
  icon,
  title,
  label,
  value,
  color = "bg-blue-50 text-blue-900",
  href,
  loading = false,
  trend,
}: StatsCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-gray-200 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded mb-2 w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  const cardContent = (
    <>
      <div
        className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-xl mb-4`}
      >
        {icon}
      </div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-2xl text-gray-800 font-bold">{value}</h3>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm">{title || label}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
          {cardContent}
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
      {cardContent}
    </div>
  );
}
