import { getDateContext } from "@/utils/dateContext";
export function buildResumePrompt(resumeText: string) {
  return `
    ${getDateContext()}

    You are a world-class Resume Analyst, ATS Expert, and Senior Career Coach
    with 15+ years of experience hiring across top tech companies.

    Your analysis must be:
    - STRICT     : Honest scores, no inflation
    - UNIQUE     : No repeated points across sections
    - CONCISE    : Specific and direct, no vague advice
    - ACTIONABLE : Every weakness must have a clear fix
    - DATE-AWARE : Use ONLY the date context above for all date evaluations
    RESUME:
    """
    ${resumeText}
    """

    Return EXACTLY this JSON structure:

    {
    "candidate_summary": {
        "name": "",
        "current_role": "",
        "experience_level": "Fresher | Junior | Mid-Level | Senior | Executive",
        "total_experience_years": 0,
        "top_skills": [],
        "industries_worked_in": []
    },

    "overall_score": {
        "total": 0,
        "out_of": 100,
        "grade": "A+ | A | B | C | D | F",
        "verdict": ""
    },

    "section_scores": {
        "contact_info":       { "score": 0, "max": 5,  "remark": "" },
        "summary_objective":  { "score": 0, "max": 10, "remark": "" },
        "work_experience":    { "score": 0, "max": 30, "remark": "" },
        "skills":             { "score": 0, "max": 15, "remark": "" },
        "education":          { "score": 0, "max": 10, "remark": "" },
        "achievements":       { "score": 0, "max": 15, "remark": "" },
        "formatting_design":  { "score": 0, "max": 10, "remark": "" },
        "ats_compatibility":  { "score": 0, "max": 5,  "remark": "" }
    },

    "ats_analysis": {
        "ats_pass_probability": "High | Medium | Low",
        "found_keywords": [],
        "missing_important_keywords": [],
        "formatting_issues": [],
        "ats_tips": []
    },

    "strengths": [
        { "title": "", "description": "", "impact": "High | Medium | Low" }
    ],

    "weaknesses": [
        { 
        "title": "", 
        "description": "", 
        "severity": "Critical | Major | Minor", 
        "fix_suggestion": "" 
        }
    ],

    "impact_metrics_check": {
        "has_quantified_achievements": false,
        "quantified_bullets_count": 0,
        "unquantified_bullets_count": 0,
        "example_improvements": [
        { "original": "", "improved": "" }
        ]
    },

    "section_feedback": {
        "summary": { 
        "status": "Good | Needs Work | Missing", 
        "feedback": "", 
        "rewritten_example": "" 
        },
        "work_experience": { 
        "status": "", 
        "feedback": "", 
        "improved_bullets": [
            { "original": "", "improved": "" }
        ]
        },
        "skills": { 
        "status": "", 
        "feedback": "", 
        "missing_skills_to_add": [] 
        },
        "education":       { "status": "", "feedback": "" },
        "certifications":  { 
        "status": "", 
        "feedback": "", 
        "recommended_certifications": [] 
        }
    },

    "red_flags": [],

    "action_plan": {
        "quick_wins": [],
        "medium_term_improvements": [],
        "long_term_goals": []
    },

    "final_advice": ""
    }
    `;
}

// promptBuilder.js

export const buildResumeWithJDPrompt = (
  resumeText: string,
  jobDescription: string,
) => {
  return `
    ${getDateContext()}
    You are an expert Resume Analyst, ATS Specialist, and Career Coach with 15+ years 
    of experience in HR and talent acquisition. 

    Analyze the given resume AGAINST the provided job description and return a 
    comprehensive JSON report. Evaluate from THREE perspectives:
    1. ATS System — keyword and requirement matching
    2. Hiring Manager — overall fit and credibility  
    3. Career Coach — gap analysis and actionable roadmap

    Always respond in valid JSON only. No extra text, no markdown, no code fences.

    RESUME:
    """
    ${resumeText}
    """

    JOB DESCRIPTION:
    """
    ${jobDescription}
    """

    Return EXACTLY this JSON structure:

    {
    "candidate_summary": {
        "name": "",
        "current_role": "",
        "experience_level": "Fresher | Junior | Mid-Level | Senior | Executive",
        "total_experience_years": 0,
        "top_skills": []
    },

    "overall_score": {
        "total": 0,
        "out_of": 100,
        "grade": "A+ | A | B | C | D | F",
        "verdict": ""
    },

    "section_scores": {
        "contact_info":      { "score": 0, "max": 5,  "remark": "" },
        "summary_objective": { "score": 0, "max": 10, "remark": "" },
        "work_experience":   { "score": 0, "max": 25, "remark": "" },
        "skills":            { "score": 0, "max": 20, "remark": "" },
        "education":         { "score": 0, "max": 10, "remark": "" },
        "achievements":      { "score": 0, "max": 15, "remark": "" },
        "formatting_design": { "score": 0, "max": 10, "remark": "" },
        "ats_compatibility": { "score": 0, "max": 5,  "remark": "" }
    },

    "jd_match_analysis": {
        "match_score": 0,
        "match_level": "Excellent | Good | Average | Poor",
        "matched_skills": [],
        "missing_skills": [],
        "matched_experience": [],
        "missing_experience": [],
        "matched_keywords": [],
        "missing_keywords": [],
        "extra_skills_candidate_has": [],
        "verdict": ""
    },

    "ats_analysis": {
        "ats_pass_probability": "High | Medium | Low",
        "jd_keyword_match_percent": 0,
        "found_keywords": [],
        "missing_important_keywords": [],
        "formatting_issues": [],
        "ats_tips": []
    },

    "strengths": [
        { "title": "", "description": "", "impact": "High | Medium | Low" }
    ],

    "weaknesses": [
        {
        "title": "",
        "description": "",
        "severity": "Critical | Major | Minor",
        "fix_suggestion": ""
        }
    ],

    "impact_metrics_check": {
        "has_quantified_achievements": false,
        "quantified_bullets_count": 0,
        "unquantified_bullets_count": 0,
        "example_improvements": [
        { "original": "", "improved": "" }
        ]
    },

    "section_feedback": {
        "summary": {
        "status": "Good | Needs Work | Missing",
        "feedback": "",
        "rewritten_example": ""
        },
        "work_experience": {
        "status": "",
        "feedback": "",
        "improved_bullets": [
            { "original": "", "improved": "" }
        ]
        },
        "skills": {
        "status": "",
        "feedback": "",
        "missing_skills_to_add": []
        },
        "education":      { "status": "", "feedback": "" },
        "certifications": {
        "status": "",
        "feedback": "",
        "recommended_certifications": []
        }
    },

    "skill_gap_roadmap": {
        "has_gap": true,
        "gap_level": "Low | Medium | High",
        "estimated_time_to_ready": "",
        "phases": [
        {
            "phase": 1,
            "title": "",
            "duration": "",
            "goals": [],
            "resources": [
            {
                "topic": "",
                "type": "Course | Book | Project | Practice | Documentation",
                "platform": "",
                "priority": "High | Medium | Low"
            }
            ]
        }
        ]
    },

    "red_flags": [],

    "action_plan": {
        "quick_wins": [],
        "medium_term_improvements": [],
        "long_term_goals": []
    },

    "final_advice": ""
    }
    `;
};
