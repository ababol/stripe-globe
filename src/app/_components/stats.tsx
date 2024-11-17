import React from "react";
import { TrendingUp, Users, CreditCard, Activity } from "lucide-react";

const stats = [
  {
    id: 1,
    name: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    icon: TrendingUp,
  },
  {
    id: 2,
    name: "Active Users",
    value: "2,338",
    change: "+15.3%",
    icon: Users,
  },
  {
    id: 3,
    name: "Transactions",
    value: "1,439",
    change: "+28.4%",
    icon: CreditCard,
  },
  {
    id: 4,
    name: "Conversion Rate",
    value: "3.24%",
    change: "+12.5%",
    icon: Activity,
  },
];

export function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 flex flex-col space-y-2"
          >
            <div className="flex items-center justify-between">
              <Icon className="w-6 h-6 text-indigo-400" />
              <span className="text-emerald-400 text-sm font-medium">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            <p className="text-gray-400">{stat.name}</p>
          </div>
        );
      })}
    </div>
  );
}
