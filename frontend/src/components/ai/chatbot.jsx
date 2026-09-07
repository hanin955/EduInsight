import { Bot, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as service from '../hooks/chatService';
const welcome = { role: 'assistant', content: 'Hello! I\'m your student assistant. Ask me a question about your statistics, your level, or the available courses.' };
export default function Chatbot({ studentId, isOpen, onClose }) {
    const [messages, setMessages] = useState([welcome]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
    const submit = async (event) => {
        event.preventDefault();
        const message = input.trim();
        if (!message || loading || !studentId) return;
        setMessages((prev) => [...prev, { role: 'user', content: message }]);
        setInput('');
        setLoading(true);
    try {
        const result = await service.sendMessage({ message, studentId });
        setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
    } catch (error) {
        setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, an error occurred. Please try again." }]);
    } finally {
        setLoading(false);
    }
    };
    if (!isOpen) return null;
    return (
        <section className="fixed bottom-20 right-4 z-40 flex h-[70vh] max-h-[550px] w-[calc(100vw-32px)] max-w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:bottom-24 sm:right-6">
            <header className="flex items-center gap-3 bg-indigo-500 px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
                <Bot size={20} className="text-indigo-500"/>
            </span>
        <div className="flex-1">
            <p className="text-sm font-semibold leading-tight">AI Student Assistant</p>
            <p className="text-xs uppercase tracking-wide text-indigo-500">Educational Support</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-white/10">
            <X size={18} />
        </button>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <p
                        className={
                        m.role === 'user'
                        ? 'max-w-[80%] rounded-2xl rounded-br-sm bg-indigo-500 px-3 py-2 text-sm text-white'
                        : 'max-w-[80%] rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2 text-sm text-gray-800'
                        }>
                        {m.content}
                    </p>
                </div>
        ))}
        {loading && (
            <div className="flex justify-start">
                <p className="max-w-[80%] rounded-2xl rounded-bl-sm bg-gray-100 px-3 py-2 text-sm text-gray-400">...</p>
            </div>
        )}
            <div ref={endRef} />
            </div>
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-gray-100 px-3 py-3">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write your question..."
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-sky-400"
            />
            <button
                type="submit"
                disabled={!input.trim() || loading}
                className="grid h-9 w-9 place-items-center rounded-full bg-indigo-500 text-white disabled:opacity-40">
            <Send size={16} />
            </button>
        </form>
    </section>
    );
}