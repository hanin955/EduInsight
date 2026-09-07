import { Bot } from 'lucide-react';
export default function ChatbotButton({ onClick, open }) {
    return <button className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-teal text-indigo-500 shadow-xl tran[???]none focus:ring-4 focus:ring-teal/25 sm:bottom-6 sm:right-6" title="AI Assistant" aria-label={open ? 'Fermer AI Assistant' : 'Ouvrir AI Assistant'} aria-expanded={open} onClick={onClick}><Bot size={25} /></button>;
}