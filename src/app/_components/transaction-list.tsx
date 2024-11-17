import React from "react";
import { DollarSign, ArrowUpRight } from "lucide-react";
import { Transaction } from "../types";

interface TransactionListProps {
  onTransactionClick?: (transaction: Transaction) => void;
  onTransactionHover?: (locationId: string | null) => void;
  hoveredLocationId?: string | null;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    amount: 499.99,
    currency: "USD",
    location: "New York, US",
    timestamp: "2 minutes ago",
    coordinates: { lat: 40.7128, long: -74.006 },
  },
  {
    id: "2",
    amount: 299.5,
    currency: "EUR",
    location: "Paris, FR",
    timestamp: "5 minutes ago",
    coordinates: { lat: 48.8566, long: 2.3522 },
  },
  {
    id: "3",
    amount: 1299.99,
    currency: "GBP",
    location: "London, UK",
    timestamp: "8 minutes ago",
    coordinates: { lat: 51.5074, long: -0.1278 },
  },
  {
    id: "4",
    amount: 799.0,
    currency: "JPY",
    location: "Tokyo, JP",
    timestamp: "12 minutes ago",
    coordinates: { lat: 35.6762, long: 139.6503 },
  },
  {
    id: "5",
    amount: 649.99,
    currency: "AUD",
    location: "Sydney, AU",
    timestamp: "15 minutes ago",
    coordinates: { lat: -33.8688, long: 151.2093 },
  },
];

export function TransactionList({
  onTransactionClick,
  onTransactionHover,
  hoveredLocationId,
}: TransactionListProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Recent Transactions
        </h2>
        <span className="text-emerald-400 text-sm font-medium">Live</span>
      </div>
      <div className="space-y-4">
        {mockTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
              hoveredLocationId === transaction.id
                ? "bg-emerald-500/20"
                : "bg-white/5 hover:bg-white/10"
            }`}
            onClick={() => onTransactionClick?.(transaction)}
            onMouseEnter={() => onTransactionHover?.(transaction.id)}
            onMouseLeave={() => onTransactionHover?.(null)}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`p-2 rounded-lg ${
                  hoveredLocationId === transaction.id
                    ? "bg-emerald-500/20"
                    : "bg-indigo-500/10"
                }`}
              >
                <DollarSign
                  className={`w-5 h-5 ${
                    hoveredLocationId === transaction.id
                      ? "text-emerald-500"
                      : "text-indigo-500"
                  }`}
                />
              </div>
              <div>
                <p className="text-white font-medium">
                  {transaction.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: transaction.currency,
                  })}
                </p>
                <p className="text-sm text-gray-400">{transaction.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {transaction.timestamp}
              </span>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
