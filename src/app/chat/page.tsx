// app/chat/page.tsx
import SchoolChat from '../component/SchoolChat';

export const metadata = {
  title: 'Student AI Helpdesk | School Management System',
  description: 'Public AI assistant for student support and inquiries.',
};

export default function ChatPage() {
  return <SchoolChat />;
}