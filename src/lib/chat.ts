/**
 * Chat -> n8n. Same workflow v4 used: POST { sessionId, message, history }
 * and read the reply out of whatever JSON shape the agent returns.
 *
 * END-PHASE TESTING FLAG: the n8n agent is switched off right now, so a live
 * round-trip has not been exercised from v5. Until it is back on, requests
 * fail and the visitor sees the "trouble reaching the server" reply.
 *
 * Endpoint: VITE_CHAT_ENDPOINT overrides the default (v4's chat webhook).
 * It is a public URL by nature - it ships in the browser bundle either way.
 */
const DEFAULT_ENDPOINT = 'https://n8n.srv1432950.hstgr.cloud/webhook/topgcontactform_sendchat'
const ENDPOINT: string = (import.meta.env.VITE_CHAT_ENDPOINT as string | undefined)?.trim() || DEFAULT_ENDPOINT

export interface ChatTurn {
  role: 'bot' | 'user'
  text: string
}

const pickString = (v: unknown): string => {
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return ''
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function extractReply(payload: any): string {
  return (
    pickString(payload?.reply) ||
    pickString(payload?.output) ||
    pickString(payload?.message) ||
    pickString(payload?.text) ||
    pickString(payload?.response) ||
    pickString(payload?.answer) ||
    pickString(payload?.content) ||
    pickString(payload?.data?.reply) ||
    pickString(payload?.data?.output) ||
    pickString(payload?.data?.message) ||
    pickString(payload?.data?.text) ||
    pickString(payload?.body?.reply) ||
    pickString(payload?.body?.output) ||
    pickString(payload?.body?.message) ||
    pickString(payload?.body?.text) ||
    pickString(payload?.result?.output) ||
    pickString(payload?.result?.text) ||
    pickString(payload?.output?.text) ||
    pickString(payload?.message?.content) ||
    pickString(payload?.choices?.[0]?.message?.content) ||
    pickString(payload?.choices?.[0]?.text) ||
    (typeof payload === 'string' ? payload : '')
  )
}

export async function sendChatMessage(args: {
  sessionId: string
  message: string
  history: ChatTurn[]
}): Promise<string> {
  if (!ENDPOINT) {
    return "I'm not connected to my brain just yet — please leave your details and Glenn will get back to you!"
  }
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    })
    if (!response.ok) {
      console.error('[Chat] Webhook returned non-OK status:', response.status)
      return 'Hmm, I had trouble reaching the server. Mind trying again?'
    }
    const raw = await response.text()
    console.debug('[Chat] raw response body:', raw)
    let reply = ''
    if ((response.headers.get('content-type') || '').includes('application/json')) {
      let data: any = raw
      try {
        data = JSON.parse(raw)
      } catch {
        /* fall through with the raw text */
      }
      reply = extractReply(Array.isArray(data) ? data[0] : data)
    } else {
      reply = raw
    }
    if (!reply) {
      console.warn('[Chat] Could not extract a reply from the webhook response (see raw body above).')
      return "⚠️ Couldn't parse n8n reply — check console for [Chat] 🪵 RAW response body"
    }
    return reply
  } catch (error) {
    console.error('[Chat] Error:', error)
    return 'Sorry, something went wrong on my end. Please try again in a moment.'
  }
}
