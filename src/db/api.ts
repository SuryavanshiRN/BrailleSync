import { supabase } from './supabase';
import type { Translation, TranslationStats } from '@/types';

export const getUserUUID = (): string => {
  let uuid = localStorage.getItem('braille-user-uuid');
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem('braille-user-uuid', uuid);
  }
  return uuid;
};

export const saveTranslation = async (
  inputText: string,
  brailleOutput: string,
  inputMethod: 'text' | 'image' | 'audio' | 'microphone'
): Promise<Translation | null> => {
  const userUuid = getUserUUID();
  
  const { data, error } = await supabase
    .from('translations')
    .insert({
      user_uuid: userUuid,
      input_text: inputText,
      braille_output: brailleOutput,
      input_method: inputMethod,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error saving translation:', error);
    return null;
  }

  return data;
};

export const getTranslations = async (
  limit = 50,
  offset = 0
): Promise<Translation[]> => {
  const userUuid = getUserUUID();
  
  const { data, error } = await supabase
    .from('translations')
    .select('*')
    .eq('user_uuid', userUuid)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching translations:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};

export const getTranslationStats = async (): Promise<TranslationStats> => {
  const userUuid = getUserUUID();
  
  const { data, error } = await supabase
    .from('translations')
    .select('input_method')
    .eq('user_uuid', userUuid);

  if (error) {
    console.error('Error fetching stats:', error);
    return {
      total: 0,
      byMethod: { text: 0, image: 0, audio: 0, microphone: 0 },
    };
  }

  const translations = Array.isArray(data) ? data : [];
  const stats: TranslationStats = {
    total: translations.length,
    byMethod: {
      text: 0,
      image: 0,
      audio: 0,
      microphone: 0,
    },
  };

  translations.forEach((t) => {
    if (t.input_method in stats.byMethod) {
      stats.byMethod[t.input_method as keyof typeof stats.byMethod]++;
    }
  });

  return stats;
};

export const deleteTranslation = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('translations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting translation:', error);
    return false;
  }

  return true;
};

export const searchTranslations = async (
  query: string
): Promise<Translation[]> => {
  const userUuid = getUserUUID();
  
  const { data, error } = await supabase
    .from('translations')
    .select('*')
    .eq('user_uuid', userUuid)
    .or(`input_text.ilike.%${query}%,braille_output.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching translations:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
};
