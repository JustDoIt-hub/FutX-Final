import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { FaSync, FaLayerGroup, FaGamepad, FaStore, FaTrophy, FaUsers } from "react-icons/fa";

interface NavigationProps {
  activeTab: string;
}

const Navigation = ({ activeTab }: NavigationProps) => {
  const [, setLocation] = useLocation();

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <nav className="flex overflow-x-auto whitespace-nowrap py-2">
          <div
            className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors cursor-pointer",
              activeTab === "spin" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}
            onClick={() => setLocation("/spin")}
          >
            <FaSync className="inline-block mr-2" /> SPIN
          </div>
          
          <div
            className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors cursor-pointer",
              activeTab === "collection" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}
            onClick={() => setLocation("/collection")}
          >
            <FaLayerGroup className="inline-block mr-2" /> COLLECTION
          </div>
          
          <div
            className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors cursor-pointer",
              activeTab === "team-battle" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}
            onClick={() => setLocation("/team-battle")}
          >
            <FaGamepad className="inline-block mr-2" /> TEAM BATTLE
          </div>
          
          <div
            className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors cursor-pointer",
              activeTab === "tournaments" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}
            onClick={() => setLocation("/tournaments")}
          >
            <FaTrophy className="inline-block mr-2" /> TOURNAMENTS
          </div>
          
          <div
            className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors cursor-pointer",
              activeTab === "shop" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}
            onClick={() => setLocation("/shop")}
          >
            <FaStore className="inline-block mr-2" /> SHOP
          </div>

          <div
            className={cn(
              "tab-item flex-shrink-0 px-5 py-3 font-bold border-b-2 transition-colors cursor-pointer",
              activeTab === "draft" 
                ? "text-yellow-400 border-yellow-400" 
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
            )}
            onClick={() => setLocation("/draft")}
          >
            <FaUsers className="inline-block mr-2" /> DRAFT
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
