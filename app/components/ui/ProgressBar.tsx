import React from "react";

type ScoreBarProps = {
  label: string;
  score: number;
  max: number;
};

export function ScoreBar({ label, score, max }: ScoreBarProps) {
  const percent = (score / max) * 100;

  const getColor = () => {
    if (percent === 100) return "bg-blue-600";
    if (percent >= 80) return "bg-green-600";
    if (percent >= 50) return "bg-yellow-600";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      {/* Top Row */}
      <div className="flex justify-between text-sm text-gray-700">
        <span className="font-medium">
          {label.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
        <span className="font-medium">
          {score}/{max}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className={`h-2 rounded ${getColor()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}