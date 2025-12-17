const OCR_API_URL = 'https://api-integrations.appmedo.com/app-8amgmr6rpywx/api-Xa6JxbyEgZea/parse/image';
const OCR_API_KEY = 'K87649693488957';

const STT_API_URL = 'https://api-integrations.appmedo.com/app-8amgmr6rpywx/api-Xa6JZJO25zqa/v1/audio/transcriptions';
const STT_API_KEY = 'aoampOdNvwF3csAVKJNXX0h0KlQ2bDJU';

const TTS_API_URL = 'https://api-integrations.appmedo.com/app-8amgmr6rpywx/api-wL1znZBlexBY/v1/audio/speech';
const TTS_API_KEY = 'aoampOdNvwF3csAVKJNXX0h0KlQ2bDJU';

export const extractTextFromImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', 'eng');

  try {
    const response = await fetch(OCR_API_URL, {
      method: 'POST',
      headers: {
        'apikey': OCR_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('OCR request failed');
    }

    const data = await response.json();

    if (data.OCRExitCode === '1' && data.ParsedResults && data.ParsedResults.length > 0) {
      return data.ParsedResults[0].ParsedText || '';
    }

    if (data.ErrorMessage) {
      throw new Error(data.ErrorMessage);
    }

    throw new Error('Failed to extract text from image');
  } catch (error) {
    console.error('OCR error:', error);
    throw error;
  }
};

export const transcribeAudio = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('response_format', 'json');

  try {
    const response = await fetch(STT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STT_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Speech-to-text request failed');
    }

    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw error;
  }
};

export const textToSpeech = async (text: string, voice = 'alloy'): Promise<Blob> => {
  try {
    const response = await fetch(TTS_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TTS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        voice: voice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Text-to-speech request failed');
    }

    return await response.blob();
  } catch (error) {
    console.error('Text-to-speech error:', error);
    throw error;
  }
};
