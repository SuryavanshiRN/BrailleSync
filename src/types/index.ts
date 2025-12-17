export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}

export interface Translation {
  id: string;
  user_uuid: string;
  input_text: string;
  braille_output: string;
  input_method: 'text' | 'image' | 'audio' | 'microphone';
  created_at: string;
}

export interface TranslationStats {
  total: number;
  byMethod: {
    text: number;
    image: number;
    audio: number;
    microphone: number;
  };
}
