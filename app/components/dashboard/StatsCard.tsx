interface StatsCardProps {
  icon: string;
  title: string;
  value: number | string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ 
  icon, 
  title, 
  value, 
  loading = false, 
  trend 
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center text-xl mb-4">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-2xl text-gray-800 font-bold">{value}</h3>
        {trend && (
          <span className={`text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
}
