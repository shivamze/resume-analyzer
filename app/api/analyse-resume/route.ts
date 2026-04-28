import { NextResponse, NextRequest } from "next/server";
import { parseResume } from "@/lib/parse";
import { buildResumePrompt,buildResumeWithJDPrompt } from "@/lib/promptBuilder";
import  { callGemini } from "@/lib/llm"

export const runtime = "nodejs";

export async function POST(request: NextRequest){

    try{
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const jdEntry = formData.get("jd");
        const jd = typeof jdEntry === "string" ? jdEntry : null;

        // ResumeValidator.validateFile(file);

        if(!file){
            return NextResponse.json(
                {error: "No File Uploaded"},
                {status:400}
            )
        }
    
        const buffer = Buffer.from(await file.arrayBuffer());
        const text = await parseResume(buffer);
    
        if(!text){
            return NextResponse.json({
                Error: "Unable to parse resume"
            }, {status: 500})
        }

        const isJDMode = typeof jd === "string" && jd.trim().length > 0;
    
        const prompt = isJDMode ? buildResumeWithJDPrompt(text, jd) : buildResumePrompt(text);
    
        if(!prompt){
            return NextResponse.json({
                Error: "Unable to build prompt"
            }, {status: 500
            })
        }
    
        const result = await callGemini(prompt);
    
        return NextResponse.json({data: result}, {status: 200})
    }catch(err: unknown){
        return NextResponse.json({
            Error: (err as Error).message || "An error occurred while processing the resume"},
            {status: 500}
        )
    }
}