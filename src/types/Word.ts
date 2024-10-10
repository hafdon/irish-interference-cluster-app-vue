// src/types/Word.ts

export interface Word {
    id: number;
    irish: string;
    english?: string;
    cluster_id?: number;
    audio?: {
      Connacht?: string;
      Munster?: string;
      Ulster?: string;
    };
  }
  
  export interface WordCreate {
    irish: string;
    english?: string;
    cluster_id?: number;
  }
  
  export interface WordUpdate {
    irish?: string;
    english?: string;
    cluster_id?: number;
  }

  // Usage in service files:

  /**
   * // src/services/wordService.ts

import axios from './axiosConfig';
import { Word, WordCreate, WordUpdate } from '@/types/Word';

export const fetchWords = async (): Promise<Word[]> => {
  try {
    const response = await axios.get<Word[]>('/words/');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createWord = async (wordData: WordCreate): Promise<Word> => {
  try {
    const response = await axios.post<Word>('/words/', wordData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ... other functions
   */