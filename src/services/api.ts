import { HfInference } from "@huggingface/inference";

const hf = new HfInference(import.meta.env.VITE_HF_TOKEN);
const OCR_API_URL = "https://api.ocr.space/parse/image";
const OCR_API_KEY = "K87649693488957";

const STT_API_URL =
  "https://api-integrations.appmedo.com/app-8amgmr6rpywx/api-Xa6JZJO25zqa/v1/audio/transcriptions";
const STT_API_KEY = "aoampOdNvwF3csAVKJNXX0h0KlQ2bDJU";

const TTS_API_URL =
  "https://api-integrations.appmedo.com/app-8amgmr6rpywx/api-wL1znZBlexBY/v1/audio/speech";
const TTS_API_KEY = "aoampOdNvwF3csAVKJNXX0h0KlQ2bDJU";

export const extractTextFromImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("OCREngine", "2");
  formData.append("filetype", file.type.split("/")[1] || "PNG");

  try {
    const response = await fetch(OCR_API_URL, {
      method: "POST",
      headers: {
        apikey: OCR_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OCR API error response:", errorText);
      throw new Error(`OCR request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.OCRExitCode === 1 || data.OCRExitCode === "1") {
      if (data.ParsedResults && data.ParsedResults.length > 0) {
        const result = data.ParsedResults[0];
        if (result.ErrorMessage && result.ErrorMessage.trim() !== "") {
          throw new Error(result.ErrorMessage);
        }
        const extractedText = result.ParsedText || "";
        if (extractedText.trim() === "") {
          throw new Error("No text detected in the image.");
        }
        return extractedText.trim();
      }
    }
    throw new Error(data.ErrorMessage || "Failed to extract text from image.");
  } catch (error) {
    console.error("OCR error details:", error);
    throw error instanceof Error ? error : new Error("Failed to process image");
  }
};

export const transcribeAudio = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("response_format", "json");

  try {
    const response = await fetch(STT_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STT_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "Speech-to-text request failed");
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Speech-to-text error:", error);
    throw error;
  }
};

export const textToSpeech = async (text: string, voice = "alloy"): Promise<Blob> => {
  try {
    const response = await fetch(TTS_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TTS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        voice: voice,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "Text-to-speech request failed");
    }

    return await response.blob();
  } catch (error) {
    console.error("Text-to-speech error:", error);
    throw error;
  }
};

export const checkGrammar = async (text: string) => {
  const params = new URLSearchParams();
  params.append('text', text);
  params.append('language', 'en-US');

  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  return await response.json(); 
};

/**
 * NEW: Automated fix helper for Grammar
 * Applies the first suggestion for every grammatical error found.
 */
export const fixGrammar = async (text: string): Promise<string> => {
  const data = await checkGrammar(text);
  let fixedText = text;
  
  // Apply matches in reverse order so character offsets remain valid
  const matches = [...data.matches].reverse();
  for (const match of matches) {
    if (match.replacements && match.replacements.length > 0) {
      const replacement = match.replacements[0].value;
      fixedText = 
        fixedText.substring(0, match.offset) + 
        replacement + 
        fixedText.substring(match.offset + match.length);
    }
  }
  return fixedText;
};

export const summarizeText = async (text: string): Promise<string> => {
  try {
    const result = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
      parameters: {
        max_length: 100,
        min_length: 30,
      }
    });

    // The library returns a simple object with the summary text
    return result.summary_text || text;
  } catch (error: any) {
    // If the model is loading (Error 503), the library helps manage the retry logic
    if (error.message?.includes("loading")) {
      console.warn("Model is loading, retrying in 3 seconds...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      return summarizeText(text);
    }
    
    console.error("Summarization error:", error);
    return text;
  }
};