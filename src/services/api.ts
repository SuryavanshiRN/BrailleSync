// Using OCR.space free API
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
    console.log("OCR API full response:", data);

    // Check if OCR was successful
    if (data.OCRExitCode === 1 || data.OCRExitCode === "1") {
      if (data.ParsedResults && data.ParsedResults.length > 0) {
        const result = data.ParsedResults[0];

        // Check if there was an error in processing this specific result
        if (result.ErrorMessage && result.ErrorMessage.trim() !== "") {
          console.error("OCR result error:", result.ErrorMessage);
          throw new Error(result.ErrorMessage);
        }

        const extractedText = result.ParsedText || "";
        if (extractedText.trim() === "") {
          throw new Error(
            "No text detected in the image. Please ensure the image contains clear, readable text."
          );
        }

        return extractedText.trim();
      }
    }

    // Handle various error cases
    if (data.IsErroredOnProcessing === true) {
      const errorMessages = data.ParsedResults?.map((r: any) => r.ErrorMessage)
        .filter(Boolean)
        .join(", ");
      throw new Error(errorMessages || "Error processing image");
    }

    if (
      data.ErrorMessage &&
      Array.isArray(data.ErrorMessage) &&
      data.ErrorMessage.length > 0
    ) {
      throw new Error(data.ErrorMessage[0]);
    }

    if (data.ErrorMessage && typeof data.ErrorMessage === "string") {
      throw new Error(data.ErrorMessage);
    }

    throw new Error(
      "Failed to extract text from image. Please try a different image with clearer text."
    );
  } catch (error) {
    console.error("OCR error details:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to process image");
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
      throw new Error(
        errorData.error?.message || "Speech-to-text request failed"
      );
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Speech-to-text error:", error);
    throw error;
  }
};

export const textToSpeech = async (
  text: string,
  voice = "alloy"
): Promise<Blob> => {
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
      throw new Error(
        errorData.error?.message || "Text-to-speech request failed"
      );
    }

    return await response.blob();
  } catch (error) {
    console.error("Text-to-speech error:", error);
    throw error;
  }
};
