"use client";

import React, { useState } from "react";
import { GlobeContainer } from "./_components/globe-container";
import { TransactionList } from "./_components/transaction-list";
import { Stats } from "./_components/stats";
import { Activity } from "lucide-react";
import { Transaction, LocationData } from "./types";

export function PageClient() {
  const [focusedTransaction, setFocusedTransaction] = useState<
    Transaction | undefined
  >();
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(
    null
  );

  const handleTransactionClick = (transaction: Transaction) => {
    setFocusedTransaction(transaction);
  };

  const handleLocationsLoad = (newLocations: LocationData[]) => {
    setLocations(newLocations);
  };

  const handleLocationHover = (locationId: string | null) => {
    setHoveredLocationId(locationId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">
              Global Transactions Dashboard
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full">
            <Stats />
            <div className="mt-8 flex justify-center">
              <GlobeContainer
                onLocationsLoad={handleLocationsLoad}
                focusedTransaction={focusedTransaction}
                onLocationHover={handleLocationHover}
                hoveredLocationId={hoveredLocationId}
              />
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <TransactionList
              onTransactionClick={handleTransactionClick}
              onTransactionHover={handleLocationHover}
              hoveredLocationId={hoveredLocationId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
