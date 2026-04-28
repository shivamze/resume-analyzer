import { ValidationError } from "./AppError";
export class ResumeValidator {
  // ── File Validation ──────────────────────────
  static validateFile(file: Express.Multer.File) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!file)
      throw new ValidationError("FILE_MISSING", "Please upload a resume file.");

    if (file.size > MAX_SIZE)
      throw new ValidationError("FILE_TOO_LARGE", "File must be under 5MB.");

    if (!ALLOWED_TYPES.includes(file.mimetype))
      throw new ValidationError(
        "INVALID_FILE_TYPE",
        "Only PDF and DOCX files are supported.",
      );
  }

  // ── Text Validation ──────────────────────────
  static validateExtractedText(text: string) {
    const MIN_LENGTH = 100;
    const MAX_LENGTH = 15000;

    if (!text || text.trim().length < MIN_LENGTH)
      throw new ValidationError(
        "EMPTY_RESUME",
        "Could not extract text. Try a non-scanned PDF.",
      );

    if (text.length > MAX_LENGTH) text = text.substring(0, MAX_LENGTH); // trim, dont throw

    // Prompt injection check
    const injectionPatterns = [
      /ignore (all |above |previous )?instructions/i,
      /you are now/i,
      /forget (everything|all)/i,
      /system prompt/i,
    ];
    injectionPatterns.forEach((p) => {
      if (p.test(text))
        throw new ValidationError(
          "INVALID_CONTENT",
          "Invalid resume content detected.",
        );
    });

    // Gibberish check
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 30)
      throw new ValidationError(
        "INSUFFICIENT_CONTENT",
        "Resume has too little content to analyze.",
      );

    return text;
  }

  // ── JD Validation ────────────────────────────
  static validateJD(jd: string) {
    if (!jd || jd.trim().length < 50)
      throw new ValidationError(
        "INVALID_JD",
        "Job description is too short. Please provide a complete JD.",
      );

    if (jd.length > 8000) jd = jd.substring(0, 8000);

    return jd.trim();
  }
}

// ── Response Validation ──────────────────────────
export class ResponseValidator {
  static validate(data: any): AnalysisResult {
    if (!data || typeof data !== "object")
      throw new Error("Invalid AI response structure");

    // Score sanity
    data.overall_score.total = this.clamp(data.overall_score.total, 0, 100);

    // Section scores
    Object.keys(data.section_scores).forEach((key) => {
      const s = data.section_scores[key];
      s.score = this.clamp(s.score, 0, s.max);
    });

    // Grade vs score sync
    data.overall_score.grade = this.syncGrade(data.overall_score.total);

    // ATS probability vs score sync
    data.ats_analysis.ats_pass_probability = this.syncATS(
      data.overall_score.total,
    );

    // Empty array fallbacks
    const arrays = [
      "strengths",
      "weaknesses",
      "improved_bullets",
      "missing_skills_to_add",
      "recommended_certifications",
    ];
    arrays.forEach((key) => {
      if (!Array.isArray(data[key])) data[key] = [];
    });

    // Null field fallbacks
    data.candidate_summary.name = data.candidate_summary?.name || "Unknown";
    data.candidate_summary.total_experience_years = Math.max(
      0,
      data.candidate_summary?.total_experience_years || 0,
    );

    return data;
  }

  private static clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }

  private static syncGrade(score: number): string {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  }

  private static syncATS(score: number): string {
    if (score >= 75) return "High";
    if (score >= 55) return "Medium";
    return "Low";
  }
}
