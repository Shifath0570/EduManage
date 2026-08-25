
import { NoticeData } from '../../types/types';
// const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/notices` || 'http://localhost:5000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

//get all notice
export async function getNotices(): Promise<NoticeData[]> {
  try {
    const response = await fetch(`${API_URL}/api/notices`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notices: ${response.status}`);
    }

    const result = await response.json();
    
    // Handle different response structures
    if (result.data) {
      return result.data;
    } else if (Array.isArray(result)) {
      return result;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching notices:', error);
    return [];
  }
}


// get notice by id
export async function getNoticeById(id: string): Promise<NoticeData | null> {
  try {
    const response = await fetch(`${API_URL}/api/notices/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notice: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.data) {
      return result.data;
    } else if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching notice:', error);
    return null;
  }
}



