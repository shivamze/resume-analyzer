import { extractText } from "unpdf";

export async function parseResume(buffer: Buffer){
    try{
        const uint8Array = new Uint8Array(buffer);
        const { text } = await extractText(uint8Array);

        if (!text) {
          throw new Error(
            "PDF is empty or contains only images (OCR required)",
          );
        }

        return text;
    }catch(err: any){
        console.error("Parsing failed: ", err );
        throw new Error("Could not read pdf");
    }
}
