"use client"
import Image from "next/image";
import { useState } from "react";
import { ResumeAnalysis } from "./components/ui/ResumeAnalysis";
import { JDMatchAnalysis } from "./components/ui/JDMatchAnalysis";

type Tab = "resume" | "jdmatch";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("resume");
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          AI-Powered Resume Analyzer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Optimize your resume for ATS systems and get instant feedback on how
          well you match job descriptions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">95%</div>
            <div className="text-sm text-blue-800">ATS Accuracy</div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">&lt;5s</div>
            <div className="text-sm text-green-800">Analysis Time</div>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">50+</div>
            <div className="text-sm text-purple-800">Insights</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "resume"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Resume Analysis
            </button>
            <button
              onClick={() => setActiveTab("jdmatch")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "jdmatch"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              JD Match Analysis
            </button>
          </div>
        </div>

        <div>
          {activeTab === "resume" && <ResumeAnalysis />}
          {activeTab === "jdmatch" && <JDMatchAnalysis />}
        </div>
      </div>
    </main>
  );
}
