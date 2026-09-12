export type ContactStatus = 'new' | 'in_progress' | 'resolved' | 'archived';

export interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  role?: 'student' | 'guardian' | 'teacher' | 'institution_admin' | 'other';
  status: ContactStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactInquiryStats {
  total: number;
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
}

export interface ContactFilterOptions {
  status: 'all' | ContactStatus;
  searchQuery: string;
  roleFilter: string;
  sortBy: 'newest' | 'oldest';
}

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  role?: string;
}

export interface ContactFormValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}
