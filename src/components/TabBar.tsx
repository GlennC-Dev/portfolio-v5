import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { openChat } from '@/lib/chatState'
import { House, FolderOpen, Phone, EnvelopeSimple, ChatCircle, Stack, User } from '@/components/slab'

/**
 * The phone navigation: a bottom tab bar with Contact as the raised action
 * in the middle. Five slots for seven routes - Showcase and Testimonials
 * are reached from Home's explore row and from the pages that cite them.
 *
 * The middle slot is a Phone trigger rather than a direct link: tapping it
 * pops out two buttons - Message (goes to /contact, same destination the
 * old single icon linked to) and Chathead (closes the pop-out and opens the
 * chat window - see ChatWidget).
 *
 * Only rendered below the shell breakpoint (App decides); from 1100px the
 * profile rail is the navigation.
 */
const TABS = [
  { label: 'Home', to: '/', Icon: House },
  { label: 'Work', to: '/projects', Icon: FolderOpen },
  { label: 'Contact', to: '/contact', Icon: Phone, primary: true },
  { label: 'Skills', to: '/services', Icon: Stack },
  { label: 'About', to: '/about', Icon: User },
] as const

export default function TabBar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <nav className="tabbar" aria-label="Primary navigation">
      {TABS.map(({ label, to, Icon, ...rest }) => {
        const primary = 'primary' in rest && rest.primary

        if (primary) {
          return (
            <div key={to} ref={wrapRef} className="tabbar__tab tabbar__tab--primary tabbar__tab--phone">
              {open && (
                <div className="tabbar__popout" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    className="tabbar__popbtn"
                    aria-label="Message"
                    onClick={() => {
                      setOpen(false)
                      navigate(to)
                    }}
                  >
                    <EnvelopeSimple size={20} weight="bold" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="tabbar__popbtn"
                    aria-label="Chat"
                    onClick={() => {
                      setOpen(false)
                      openChat()
                    }}
                  >
                    <ChatCircle size={20} weight="bold" aria-hidden="true" />
                  </button>
                </div>
              )}
              <button
                type="button"
                className="tabbar__fab-btn"
                aria-label={open ? 'Close contact options' : label}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <span className="tabbar__fab">
                  <Icon size={24} weight="bold" aria-hidden="true" />
                </span>
              </button>
            </div>
          )
        }

        return (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="tabbar__tab"
          >
            <Icon size={21} weight="duotone" aria-hidden="true" />
            <span className="tabbar__label">{label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
