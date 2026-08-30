
import { NoticeItem } from "@/types/types";

// Explicitly target 127.0.0.1 to prevent Node 18+ IPv6 localhost mapping issues
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

export async function getNotices(): Promise<NoticeItem[]> {
  try {
    const response = await fetch(`${API_URL}/api/notices`, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notices: ${response.statusText}`);
    }

    const result = await response.json();
    return Array.isArray(result) ? result : result.data || [];
  } catch (error) {
    console.error("Error fetching notices:", error);
    return []; 
  }
}

export async function getNoticeById(id: string): Promise<NoticeItem | null> {
  try {
    const response = await fetch(`${API_URL}/api/notices/${id}`, {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notice: ${response.status}`);
    }

    const result = await response.json();
    return result.data || result || null;
  } catch (error) {
    console.error("Error fetching notice:", error);
    return null;
  }
}




