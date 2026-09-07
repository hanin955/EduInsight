import { Outlet } from 'react-router-dom';
import Chatbot from '../ai/Chatbot';
import ChatbotButton from '../ai/ChatbotButton';
import { useCurrentStudent } from '../hooks/useCurrentStudent';
import { useState } from 'react';

export default function Layout() {
  const student = useCurrentStudent();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Outlet />
      <Chatbot studentId={student?._id} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <ChatbotButton open={isOpen} onClick={() => setIsOpen((value) => !value)} />
    </>
  );
}