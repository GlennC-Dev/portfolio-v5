import { useEffect, useRef, useState } from 'react'
import { ChatCircleDots, X, PaperPlaneRight } from '@/components/slab'
import { profile } from '@/data/profile'
import { getChatSessionId } from '@/lib/chatSession'
import { sendChatMessage } from '@/lib/chat'
import { closeChat, toggleChat, useChatOpen } from '@/lib/chatState'

/**
 * ChatWidget - v4's chat window on v5's shell.
 * Desktop: a floating trigger bottom-right on every page. Phone: no trigger
 * (it would sit on the tab bar) - the window opens from the Chathead button
 * that pops out of the tab bar's Phone icon. Open state lives in lib/chatState.
 */

interface Message {
  role: 'bot' | 'user'
  text: string
  time: string
}

const GREETING =
  "Hey! I'm Glenn's assistant. Ask me about his skills, projects, or availability — or leave your details and he'll get back to you. 👋"

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function ChatWidget({ phone }: { phone: boolean }) {
  const isOpen = useChatOpen()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Greeting on first open, after a short beat (v4 behaviour).
  useEffect(() => {
    if (!isOpen || messages.length > 0) return
    const t = setTimeout(() => setMessages([{ role: 'bot', text: GREETING, time: now() }]), 400)
    return () => clearTimeout(t)
  }, [isOpen, messages.length])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isTyping])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeChat()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text || isTyping) return
    setInput('')
    const updated: Message[] = [...messages, { role: 'user', text, time: now() }]
    setMessages(updated)
    setIsTyping(true)
    try {
      const reply = await sendChatMessage({
        sessionId: getChatSessionId(),
        message: text,
        history: updated.map((m) => ({ role: m.role, text: m.text })),
      })
      setMessages((prev) => [...prev, { role: 'bot', text: reply, time: now() }])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  return (
    <>
      {!phone && (
        <button
          type="button"
          className="chat__trigger"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          aria-expanded={isOpen}
          onClick={toggleChat}
        >
          {isOpen ? <X size={22} weight="bold" aria-hidden="true" /> : <ChatCircleDots size={26} weight="fill" aria-hidden="true" />}
        </button>
      )}

      <div
        className={`chat__panel${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-label="Chat with Glenn's assistant"
        aria-hidden={!isOpen}
        // `inert` keeps the closed (visually hidden) window out of the tab order.
        inert={!isOpen}
      >
        <header className="chat__head">
          <img className="chat__avatar" src={profile.avatarSrc} alt="" />
          <div className="chat__who">
            <div className="chat__name">Glenn&apos;s Assistant</div>
            <div className="chat__status">
              <span className="chat__dot" aria-hidden="true" />
              Online now
            </div>
          </div>
          <button type="button" className="chat__close" aria-label="Close chat" onClick={closeChat}>
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </header>

        <div ref={listRef} className="chat__list" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`chat__msg chat__msg--${m.role}`}>
              <div className="chat__bubble">{m.text}</div>
              <div className="chat__time">{m.time}</div>
            </div>
          ))}
          {isTyping && (
            <div className="chat__msg chat__msg--bot">
              <div className="chat__bubble chat__bubble--typing">Typing…</div>
            </div>
          )}
        </div>

        <form className="chat__form" onSubmit={send}>
          <input
            ref={inputRef}
            type="text"
            className="chat__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything…"
            aria-label="Message"
            enterKeyHint="send"
            inputMode="text"
            autoComplete="off"
          />
          <button type="submit" className="chat__send" aria-label="Send message">
            <PaperPlaneRight size={18} weight="fill" aria-hidden="true" />
          </button>
        </form>
      </div>
    </>
  )
}
