"use client"
import { useState } from "react"
import { FileText, Info,} from 'lucide-react'

export function Header(){
    return (
      <div>
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="text-xl font-semibold text-gray-900">
                  ResumeAI
                </span>
              </div>

              {/* Nav Actions */}
              <div className="flex items-center gap-3">
                <button
                  variant="outline"
                  onClick={() => setShowAbout(!showAbout)}
                >
                  <Info className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">About</span>
                </button>
                <button onClick={() => setActiveTab("resume")}>Analyze</button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    );
}