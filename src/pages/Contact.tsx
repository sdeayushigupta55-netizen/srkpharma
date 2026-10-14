import {
  Clock,
  Loader2,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import AnimatedSection from '../components/ui/AnimatedSection'
import PageHero3D from '../components/ui/PageHero3D'
import SectionHeading from '../components/ui/SectionHeading'
import { company } from '../data/company'
import { sendContactOtp, submitContactForm } from '../utils/contactApi'

const RESEND_SECONDS = 60

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: 'Product Inquiry',
    message: '',
    otp: '',
  })

  const [otpSent, setOtpSent] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [loadingOtp, setLoadingOtp] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // -------------------------------------------------------
  // OTP resend countdown
  // -------------------------------------------------------

  useEffect(() => {
    if (resendIn <= 0) {
      return
    }

    const timer = window.setTimeout(() => {
      setResendIn((value) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [resendIn])

  // -------------------------------------------------------
  // Update form fields
  // -------------------------------------------------------

  const updateField = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'email'
        ? {
            otp: '',
          }
        : {}),
    }))

    setError('')

    // If email changes, previously requested OTP
    // is no longer valid for the new email.
    if (field === 'email') {
      setOtpSent(false)
      setResendIn(0)
    }
  }

  // -------------------------------------------------------
  // Send Email OTP
  // -------------------------------------------------------

  const handleSendOtp = async () => {
    const email = form.email.trim()

    if (!email) {
      setError('Enter your email address.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    setLoadingOtp(true)
    setError('')

    try {
      const result = await sendContactOtp(email)

      setOtpSent(true)
      setResendIn(
        result.retry_after ?? RESEND_SECONDS,
      )

      // Clear any previous OTP when requesting a new one.
      setForm((current) => ({
        ...current,
        email,
        otp: '',
      }))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to send OTP.',
      )
    } finally {
      setLoadingOtp(false)
    }
  }

  // -------------------------------------------------------
  // Submit contact form
  // -------------------------------------------------------

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    setError('')

    // Make sure OTP was requested.
    if (!otpSent) {
      setError(
        'Please verify your email with OTP before sending.',
      )
      return
    }

    // Validate OTP.
    if (form.otp.length !== 6) {
      setError(
        'Enter the 6-digit OTP sent to your email.',
      )
      return
    }

    setLoadingSubmit(true)

    try {
      await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        subject: form.subject,
        message: form.message.trim(),
        otp: form.otp,
      })

      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to send message.',
      )
    } finally {
      setLoadingSubmit(false)
    }
  }

  // -------------------------------------------------------
  // Success screen
  // -------------------------------------------------------

  if (submitted) {
    return (
      <>
        <PageHero3D
          label="Get in Touch"
          title="Contact Us"
          subtitle="Have questions about our products or interested in partnership? We would love to hear from you."
        />

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>

                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Message Sent!
                </h3>

                <p className="text-green-600">
                  Thank you for reaching out. We will get back
                  to you shortly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  // -------------------------------------------------------
  // Contact page
  // -------------------------------------------------------

  return (
    <>
      <PageHero3D
        label="Get in Touch"
        title="Contact Us"
        subtitle="Have questions about our products or interested in partnership? We would love to hear from you."
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* =================================================
                LEFT SIDE - CONTACT INFORMATION
            ================================================= */}

            <AnimatedSection className="lg:col-span-2">
              <SectionHeading
                label="Reach Us"
                title="We Are Here to Help"
                centered={false}
              />

              <div className="space-y-6">
                {[
                  {
                    icon: MapPin,
                    label: 'Address',
                    value: company.contact.address,
                    href: undefined,
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    value: company.contact.email,
                    href: `mailto:${company.contact.email}`,
                  },
                  {
                    icon: Clock,
                    label: 'Business Hours',
                    value: company.contact.hours,
                    href: undefined,
                  },
                ].map(
                  ({
                    icon: Icon,
                    label,
                    value,
                    href,
                  }) => (
                    <div
                      key={label}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase">
                          {label}
                        </p>

                        {href ? (
                          <a
                            href={href}
                            className="text-navy-900 font-medium hover:text-orange-500 transition-colors break-all"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-navy-900 font-medium">
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </AnimatedSection>

            {/* =================================================
                RIGHT SIDE - CONTACT FORM
            ================================================= */}

            <AnimatedSection
              delay={0.1}
              className="lg:col-span-3"
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5"
              >

                {/* =================================================
                    NAME + EMAIL
                ================================================= */}

                <div className="grid  gap-5">

                  {/* Full Name */}

                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-navy-900 mb-1.5"
                    >
                      Full Name *
                    </label>

                    <input
                      id="contact-name"
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        updateField(
                          'name',
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20 outline-none transition-all"
                      placeholder="Dr. John Smith"
                    />
                  </div>

                  {/* Email + OTP */}

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-navy-900 mb-1.5"
                    >
                      Email *
                    </label>

                    <div className="flex flex-col sm:flex-row gap-3">

                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input
                          id="contact-email"
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            updateField(
                              'email',
                              e.target.value,
                            )
                          }
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20 outline-none transition-all"
                          placeholder="you@example.com"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={
                          loadingOtp ||
                          resendIn > 0
                        }
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-orange-200 text-orange-600 font-semibold hover:bg-orange-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shrink-0"
                      >
                        {loadingOtp ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}

                        {resendIn > 0
                          ? `Resend in ${resendIn}s`
                          : otpSent
                            ? 'Resend OTP'
                            : 'Send OTP'}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      We will send a one-time password to your
                      email address to verify your inquiry.
                    </p>
                  </div>
                </div>
                 {/* =================================================
                    OTP
                ================================================= */}

{otpSent && (
                  <div>
                    <label
                      htmlFor="contact-otp"
                      className="block text-sm font-medium text-navy-900 mb-1.5"
                    >
                      Email OTP *
                    </label>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <input
                        id="contact-otp"
                        required
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={form.otp}
                        onChange={(e) =>
                          updateField(
                            'otp',
                            e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 6),
                          )
                        }
                        className="w-full sm:w-48 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20 outline-none transition-all tracking-[0.35em] text-center font-semibold"
                        placeholder="000000"
                      />

                      <span className="text-xs text-gray-500">
                        Check your email inbox and spam folder.
                      </span>
                    </div>
                  </div>
                )}

                {/* =================================================
                    MOBILE NUMBER
                ================================================= */}

                <div>
                  <label
                    htmlFor="contact-mobile"
                    className="block text-sm font-medium text-navy-900 mb-1.5"
                  >
                    Mobile Number *
                  </label>

                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                    <input
                      id="contact-mobile"
                      required
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.mobile}
                      onChange={(e) =>
                        updateField(
                          'mobile',
                          e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 10),
                        )
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20 outline-none transition-all"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

               

                {/* =================================================
                    SUBJECT
                ================================================= */}

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-sm font-medium text-navy-900 mb-1.5"
                  >
                    Subject
                  </label>

                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) =>
                      updateField(
                        'subject',
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20 outline-none transition-all bg-white"
                  >
                    <option>
                      Product Inquiry
                    </option>

                    <option>
                      Partnership / Distribution
                    </option>

                    <option>
                      General Inquiry
                    </option>

                    <option>
                      Other
                    </option>
                  </select>
                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-medium text-navy-900 mb-1.5"
                  >
                    Message *
                  </label>

                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      updateField(
                        'message',
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                {/* =================================================
                    SUBMIT
                ================================================= */}

                <button
                  type="submit"
                  disabled={
                    loadingSubmit ||
                    !otpSent ||
                    form.otp.length !== 6
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full gradient-orange text-white font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingSubmit ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}

                  Send Message
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}