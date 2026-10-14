const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? '/api'

async function parseJsonResponse(response: Response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      typeof data.message === 'string'
        ? data.message
        : 'Something went wrong. Please try again.',
    )
  }
  return data as { success: boolean; message: string; retry_after?: number; expires_in?: number }
}

export async function sendContactOtp(email: string) {
  const response = await fetch(`${API_BASE}/send-otp.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  })

  return parseJsonResponse(response)
}

export async function submitContactForm(payload: {
  name: string
  email: string
  mobile: string
  subject: string
  message: string
  otp: string
}) {
  const response = await fetch(`${API_BASE}/contact.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return parseJsonResponse(response)
}
