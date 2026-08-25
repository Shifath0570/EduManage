// types/index.ts
export interface IssuedBy {
  name: string;
  designation: string;
  email: string;
  contactNumber: string;
}

export interface Content {
  subject: string;
  summary: string;
  fullText: string;
}

// Define the type for a notice item
export interface NoticeItem {
    _id: string;
    title: string;
    issuedDate: string;
    status?: string;
    isActive?: boolean;
    content?: {
        subject: string;
        summary: string;
        fullText: string;
    };
    issuedBy?: {
        name: string;
        designation: string;
        email: string;
        contactNumber: string;
    };
}


export interface ApiResponse {
  success?: boolean;
  data?: NoticeItem[];
  message?: string;
}