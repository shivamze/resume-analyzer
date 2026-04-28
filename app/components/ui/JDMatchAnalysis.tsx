"use client";
import React, { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { FileUpload } from "./FileUpload";
import {Textarea} from "./Textarea"; 
import { ScoreBar } from "./ProgressBar";
import { LoadingSpinner } from "./LoadingSpiner";
import { CheckCircle, AlertCircle, Lightbulb, Sparkles } from "lucide-react";
import axios from "axios";
// import { SkillGapRoadmapData } from "./SkillGapRoadmap";

interface Resource {
  topic: string;
  type: "Course" | "Practice" | "Project" | "Book" | "Documentation";
  platform: string;
  priority: "High" | "Medium" | "Low";
}

interface Phase {
  phase: number;
  title: string;
  duration: string;
  goals: string[];
  resources: Resource[];
}

export interface SkillGapRoadmapData {
  has_gap: boolean;
  gap_level: string;
  estimated_time_to_ready: string;
  phases: Phase[];
}

interface SectionScore {
  key: string;
  title: string;
  score: number;
  max: number;
  remark: string;
}

interface AnalysisResult {
  candidate_summary: {
    name: string;
    current_role: string;
    experience_level: string;
    total_experience_years: number;
  };
  section_scores: Record<string, RawSectionScore>;
  overall_score: {
    total: number;
    grade: string;
  };
  strengths: {
    title: string;
    description: string;
  }[];
  weaknesses: {
    title: string;
    description: string;
  }[];
  ats_analysis: {
    ats_pass_probability: string;
    found_keywords: string[];
    missing_important_keywords: string[];
  };
  action_plan: {
    quick_wins: string[];
    medium_term_improvements: string[];
    long_term_goals: string[];
  };

  section_feedback: {
    skills: {
      missing_skills_to_add: string[];
    };
    certifications: {
      recommended_certifications: string[];
    };
    work_experience: {
      improved_bullets: {
        original: string;
        improved: string;
      }[];
    };
  };

  impact_metrics_check: {
    has_quantified_achievements: boolean;
    quantified_bullets_count: number;
    unquantified_bullets_count: number;
  };

  skill_gap_roadmap: SkillGapRoadmapData;

  final_advice: string;
}

interface RawSectionScore {
  score: number;
  max: number;
  remark?: string; // optional kyunki kabhi kabhi nahi hota
}

// Step 2 — Function properly type karo
const formatSectionScores = (
  data: Record<string, RawSectionScore> | undefined | null,
): SectionScore[] => {
  if (!data || typeof data !== "object") return []; // ✅ null/undefined safe

  return Object.entries(data).map(([key, value]) => ({
    // ✅ no any
    key,
    title: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    score: typeof value?.score === "number" ? value.score : 0, // ✅ safe
    max: typeof value?.max === "number" ? value.max : 1, // ✅ safe
    remark: value?.remark ?? "", // ✅ safe
  }));
};

export function JDMatchAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("please select a file to analyze");
      return;
    }
    try {
      setIsAnalyzing(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("jd", jobDescription)

      const res = await axios.post("/api/analyse-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Api response: ", res.data);

      setResult(res.data.data);
    } catch (err: any) {
      console.error("Error occurred while analyzing resume:", err);
      return err;
    } finally {
      setIsAnalyzing(false);
    }

    // Simulate API call with mock data
    // setTimeout(() => {
    //   setResult({
    //     atsScore: 38,
    //     strengths: [
    //       "Clear work experience with quantifiable achievements",
    //       "Relevant technical skills highlighted",
    //       "Well-structured education section",
    //       "Professional summary is concise and impactful",
    //     ],
    //     weaknesses: [
    //       "Missing keywords for target role",
    //       "Limited use of action verbs",
    //       "No measurable results in 2 job descriptions",
    //       "Contact information could be more prominent",
    //     ],
    //     suggestions: [
    //       'Add more industry-specific keywords (e.g., "Agile", "Scrum")',
    //       "Include metrics: revenue impact, project size, team size",
    //       'Use stronger action verbs: "spearheaded", "orchestrated"',
    //       "Add a skills matrix or technical proficiencies section",
    //       "Consider adding relevant certifications",
    //     ],
    //   });
    //   setIsAnalyzing(false);
    // }, 2000);
  };

  const handleDemoAnalyze = () => {
    // Create a mock file for demo
    const mockFile = new File([""], "sample-resume.pdf", {
      type: "application/pdf",
    });
    setFile(mockFile);
    setResult(null);

    // Auto-trigger analysis
    setTimeout(() => {
      handleAnalyze();
    }, 500);
  };

  const formattedResult = result
    ? {
        ...result,
        section_scores: formatSectionScores(result.section_scores),
      }
    : null;

    const getPriorityStyle = (priority: string) => {
      switch (priority) {
        case "High":
          return "bg-red-100 text-red-600";
        case "Medium":
          return "bg-yellow-100 text-yellow-700";
        case "Low":
          return "bg-green-100 text-green-600";
        default:
          return "bg-gray-100 text-gray-600";
      }
    };

    const getTypeStyle = (type: string) => {
      switch (type) {
        case "Course":
          return "bg-blue-100 text-blue-600";
        case "Practice":
          return "bg-indigo-100 text-indigo-600";
        case "Project":
          return "bg-green-100 text-green-600";
        case "Book":
          return "bg-purple-100 text-purple-600";
        default:
          return "bg-gray-100 text-gray-600";
      }
    };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!result && (
        <div className="flex justify-end mt-2">
          <Button
            variant="outline"
            onClick={handleDemoAnalyze}
            disabled={isAnalyzing}
            className="w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Try Demo
          </Button>
        </div>
      )}

      {result && (
        <div className="flex justify-end mt-3">
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setFile(null);
              setJobDescription("");
            }}
            disabled={isAnalyzing}
            className="w-full sm:w-auto"
          >
            New Analysis
          </Button>
        </div>
      )}

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Upload */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload Resume
          </h2>
          <FileUpload onFileSelect={handleFileSelect} disabled={isAnalyzing} />
        </Card>

        {/* Job Description */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Job Description
          </h2>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              setResult(null);
            }}
            rows={8}
            disabled={isAnalyzing}
          />
          <p className="text-sm text-gray-500 mt-2">
            {jobDescription.length} characters (minimum 50)
          </p>
        </Card>
      </div>

      {/* Analyze Button */}
      {(file || jobDescription) && !result && (
        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-8"
          >
            {isAnalyzing ? "Analyzing Match..." : "Analyze Match"}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <Card>
          <LoadingSpinner />
          <p className="text-center text-gray-600 mt-4">
            Analyzing your resume...
          </p>
        </Card>
      )}

      {/* Results Section */}
      {result && !isAnalyzing && (
        <div className="space-y-6 animate-fade-in">
          {/* ATS Score */}
          <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                {result.candidate_summary.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {result.candidate_summary.current_role} ·{" "}
                {result.candidate_summary.experience_level} · ~
                {result.candidate_summary.total_experience_years}yr exp
              </p>

              <div className="flex gap-2 mt-2 text-sm">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  ATS: {result.ats_analysis.ats_pass_probability}
                </span>
                <span className="bg-blue-100 text-blue-500 px-2 py-1 rounded">
                  Grade: {result.overall_score.grade}
                </span>
                {/* <span className="bg-orange-100 text-stone-500 px-2 py-1 rounded">
                  Critical Issue: 1
                </span> */}
              </div>
            </div>

            <div className="text-right">
              <p className="text-gray-500">Overall Score</p>
              <h1 className="text-4xl font-bold text-center">
                {result.overall_score.total}
              </h1>
            </div>
          </div>

          <Card>
            <div className="flex justify-between mt-2">
              <div className="min-w-auto">
                <div className="text-sm">ATS Pass</div>
                <div className="text-2xl text-green-600">
                  {result.ats_analysis.ats_pass_probability}
                </div>
                <span className="text-sm text-gray-600">
                  Well structured Format
                </span>
              </div>
              <div className="min-w-auto">
                <div className="text-sm">Quantified Bullets</div>
                <div className="text-2xl text-gray-700">
                  {result.impact_metrics_check.quantified_bullets_count}
                </div>
                <span className="text-sm text-red-700">
                  {result.impact_metrics_check.unquantified_bullets_count}{" "}
                  bullets need numbers
                </span>
              </div>
              <div className="min-w-auto">
                <div className="text-sm">Experience</div>
                <div className="text-2xl text-green-600">
                  {result.candidate_summary.total_experience_years} Yr
                </div>
                {/* <span className="text-sm text-gray-600">2 Internships</span> */}
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="font-bold text-gray-500 mb-4 ">SECTION SCORES</h2>
            <div className=" p-1 m-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {formattedResult?.section_scores.map((section) => (
                <div className="flex-1 w-full font-bold" key={section.key}>
                  <ScoreBar
                    label={section.title}
                    score={section.score}
                    max={section.max}
                  />
                </div>
              ))}
              {/* <div className="flex-1 w-full font-bold">
                <ScoreBar
                  label="Work Experience"
                  score={result.overall_score.total}
                  max={100}
                />
              </div> */}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              JD Match Analysis
            </h2>

            {/* Top Section */}
            <div className="flex items-center gap-6 mb-4">
              {/* Score */}
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900">
                  {result.overall_score.total}
                  <span className="text-lg font-medium text-gray-500">%</span>
                </h1>
                <p className="text-sm text-gray-500">match score</p>
              </div>

              {/* Progress Bar */}
              <div className="flex-1">
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${result.overall_score.total}%` }}
                  />
                </div>

                {/* Subtitle */}
                <p className="text-sm text-gray-600 mt-2">
                  {result.overall_score.total >= 75
                    ? "Good match — strong core alignment, few gaps"
                    : result.overall_score.total >= 50
                      ? "Moderate match — some improvements needed"
                      : "Low match — significant skill gaps"}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Matched Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.ats_analysis.found_keywords.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 border border-green-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Missing Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.ats_analysis.missing_important_keywords.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600 border border-red-200"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Analysis Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Strengths</h3>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {result.strengths.map((item, index) => (
                  <li className="p-1" key={index}>
                    <span className="font-semibold text-gray-600">
                      {item.title}
                    </span>{" "}
                    - {item.description}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Weaknesses */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900">Weaknesses</h3>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {result.weaknesses.map((item, index) => (
                  <li className="p-1" key={index}>
                    <span className="font-semibold text-gray-600">
                      {item.title}
                    </span>{" "}
                    - {item.description}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card>
            <h3 className="text-sm font-bold text-gray-600 p-1 m-1">
              IMPROVED BULLETS - BEFORE VS AFTER
            </h3>
            {result.section_feedback.work_experience?.improved_bullets?.map(
              (item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1 m-1"
                >
                  <div className="bg-amber-50 p-1 rounded inset-shadow-sm inset-shadow-gray-400/50">
                    <h6 className="text-sm font-semibold text-gray-600 p-1 mx-1">
                      BEFORE
                    </h6>
                    <p className="px-2 text-sm text-gray-700">
                      {item.original}
                    </p>
                  </div>
                  <div className="bg-green-100 p-1 rounded inset-shadow-sm inset-shadow-green-400/50">
                    <h6 className="text-sm font-semibold text-green-600 p-1 mx-1">
                      AFTER
                    </h6>
                    <p className="px-2 text-sm text-gray-600">
                      {item.improved}
                    </p>
                  </div>
                </div>
              ),
            )}
          </Card>

          <Card>
            <h2 className="font-bold text-gray-500 ">SKILLS TO ADD</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Missing from skills section
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.section_feedback.skills?.missing_skills_to_add?.map(
                    (keyword, index) => (
                      <span
                        className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 border border-red-200"
                        key={index}
                      >
                        {keyword}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Recommended Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.section_feedback.certifications?.recommended_certifications?.map(
                    (keyword, index) => (
                      <span
                        className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-200"
                        key={index}
                      >
                        {keyword}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="bg-white rounded-2xl p-6  mx-auto">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase">
                  Skill Gap Roadmap
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {result.skill_gap_roadmap.estimated_time_to_ready} ·{" "}
                  {result.skill_gap_roadmap.gap_level} Gap
                </p>
              </div>

              {/* Phases */}
              <div className="space-y-6">
                {result.skill_gap_roadmap.phases.map((phase, index) => (
                  <div key={index} className="flex gap-4">
                    {/* Number Circle */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-semibold">
                        {phase.phase}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-800">
                        {phase.title}
                      </h3>

                      <p className="text-sm text-gray-500 mb-2">
                        {phase.duration}
                      </p>

                      {/* Goals */}
                      <ul className="text-sm text-gray-600 mb-3 space-y-1">
                        {phase.goals.slice(0, 2).map((goal, i) => (
                          <li key={i}>• {goal}</li>
                        ))}
                      </ul>

                      {/* Resources */}
                      <div className="space-y-2">
                        {phase.resources.map((res, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 flex-wrap"
                          >
                            {/* Type Badge */}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeStyle(
                                res.type,
                              )}`}
                            >
                              {res.type}
                            </span>

                            {/* Topic */}
                            <span className="text-sm text-gray-700">
                              {res.topic} — {res.platform}
                            </span>

                            {/* Priority */}
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs font-medium ${getPriorityStyle(
                                res.priority,
                              )}`}
                            >
                              {res.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-gray-500 text-sm font-bold p-1">ACTION PLAN</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-1">
              <div>
                <h4 className="text-sm font-semibold text-green-600 p-1">
                  Quick Wins
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {result.action_plan.quick_wins.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-yellow-900 p-1">
                  Medium Term
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {result.action_plan.medium_term_improvements.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    ),
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-600 p-1">
                  Long Term
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {result.action_plan.long_term_goals.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="inset-shadow-sm inset-shadow-blue-800">
            <h2 className="text-gray-500 font-bold  ">Final Advice</h2>
            <p className="p-1 text-sm text-gray-500">{result.final_advice}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
