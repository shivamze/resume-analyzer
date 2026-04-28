"use client"
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${hover ? "transition-shadow hover:shadow-md" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
