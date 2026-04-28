// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function callGemini(prompt: string){
//     try{
//         const model = genAI.getGenerativeModel({
//             model: "gemini-2.5-flash",
//             generationConfig: {
//                 responseMimeType: "application/json",
//                 temperature: 0.1,
//             }
//         });

//         const result = await model.generateContent(prompt);
//         const response = result.response;
//         const text = response.text()
//         try {
//         return JSON.parse(text);
//         } catch (err) {
//         console.error("Invalid JSON:", text);
//         throw new Error("Invalid AI response format");
//         }
//     }catch(err: any){
//         console.error("Gemini API Error: ", err);
//         throw new Error(err.message)
//     }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Sleeps for a given number of milliseconds
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function callGemini(
  prompt: string,
  attempt: number = 1,
): Promise<any> {
  const MAX_RETRIES = 3;
  const INITIAL_DELAY = 2000; // 2 seconds

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      // Standardizing the response: strip potential markdown fences
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (jsonErr) {
      console.error("JSON Parse Error. Raw Text:", text);
      throw new Error("AI returned an unparsable format.");
    }
  } catch (err: any) {
    // Extract status code (Gemini SDK sometimes puts it in err.status or err.message)
    const statusCode =
      err.status ||
      (err.message?.includes("503")
        ? 503
        : err.message?.includes("429")
          ? 429
          : null);

    // 503 = Service Unavailable, 429 = Rate Limit
    const isRetryable = statusCode === 503 || statusCode === 429;

    if (isRetryable && attempt <= MAX_RETRIES) {
      // Exponential Backoff calculation: 2s, 4s, 8s...
      const waitTime = INITIAL_DELAY * Math.pow(2, attempt - 1);

      console.warn(
        `[Attempt ${attempt}] Gemini is busy (Status: ${statusCode}). Retrying in ${waitTime}ms...`,
      );

      await sleep(waitTime);
      return callGemini(prompt, attempt + 1); // Recursive call for retry
    }

    // If we exhausted retries or it's a non-retryable error (like 400 Bad Request)
    console.error("Final Gemini Error:", err.message);

    if (statusCode === 503) {
      throw new Error(
        "The AI server is currently overloaded. Please wait a moment and try again.",
      );
    }

    throw new Error(
      err.message || "An unexpected error occurred during AI analysis.",
    );
  }
}