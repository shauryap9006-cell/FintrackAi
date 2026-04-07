'use client';

import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PieChart, PlusCircle, Sparkles } from 'lucide-react';
import "./sidebar.css";

const Sidebar = () => {
  const pathname = usePathname();

  const items = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
    { name: "Analytics", icon: <PieChart size={18} />, href: "/analytics" },
    { name: "Add Expense", icon: <PlusCircle size={18} />, href: "/add-expense" },
    { name: "AI Insights", icon: <Sparkles size={18} />, href: "/ai-insights" },
  ];

  return (
    <div className="sidebar">
      {/* Menu Area */}
      <div className="menu">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`menu-item ${isActive ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
