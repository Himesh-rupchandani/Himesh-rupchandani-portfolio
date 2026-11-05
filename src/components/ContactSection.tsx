import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, MapPin, Linkedin, Github, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    details?: string;
  }>({ type: null, message: '' });

  const { accentColors } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status.type) setStatus({ type: null, message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setStatus({
        type: 'error',
        message: 'Please fill in all required fields.',
      });
      return;
    }

    if (formData.message.trim().length < 10) {
      setStatus({
        type: 'error',
        message: 'Please provide at least 10 characters in your message.',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: data.deliveredDirectly
            ? 'Your message was delivered directly to Himesh\'s inbox!'
            : 'Message received and securely recorded on server database.',
          details: data.message,
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to submit message. Please try again or reach out on LinkedIn.',
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Network error communicating with the server. Please check your connection or connect via LinkedIn.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-slate-800/80 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div
            className="text-xs font-semibold tracking-wider uppercase mb-2 font-mono"
            style={{ color: accentColors.primary }}
          >
            07. Initiate Collaboration
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get in Touch
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Currently open to Summer 2027 internship inquiries, computer vision research discussions, and open-source collaborations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Social (5 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-8 bg-[#0E1526] border border-slate-800 rounded-3xl space-y-5 shadow-xl">
              <h3 className="font-display text-lg font-bold text-white">
                Direct Contact Channels
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Feel free to connect directly via LinkedIn or explore my public repositories on GitHub. I respond promptly to internship and project inquiries.
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-center gap-3 text-slate-300">
                  <div className="p-2.5 bg-[#080B11] rounded-xl border border-slate-800 text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-mono">Location</span>
                    <span className="font-medium text-slate-200">Rajkot, Gujarat, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <div className="p-2.5 bg-[#080B11] rounded-xl border border-slate-800 text-white">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-mono">LinkedIn</span>
                    <a
                      href={PERSONAL_INFO.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                      style={{ color: accentColors.primary }}
                    >
                      linkedin.com/in/himesh-rupchandani
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <div className="p-2.5 bg-[#080B11] rounded-xl border border-slate-800 text-white">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-mono">GitHub</span>
                    <a
                      href={PERSONAL_INFO.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                      style={{ color: accentColors.primary }}
                    >
                      github.com/Himesh-rupchandani
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Note on Authenticity */}
            <div className="p-5 bg-[#0E1526]/60 border border-slate-800/80 rounded-2xl text-xs text-slate-400 space-y-1.5">
              <span className="font-semibold block font-mono" style={{ color: accentColors.primary }}>
                Transparency Notice:
              </span>
              <p>
                Messages submitted through this form are validated and written to our backend database. If real-time inbox relay credentials (such as Resend) are configured in the environment, the note is transmitted immediately to Himesh's email.
              </p>
            </div>
          </motion.div>

          {/* Contact Form (7 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 sm:p-10 bg-[#0E1526] border border-slate-800 rounded-3xl shadow-2xl space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Maya Patel"
                    className="w-full px-4 py-2.5 bg-[#080B11] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. maya@example.com"
                    className="w-full px-4 py-2.5 bg-[#080B11] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Internship Inquiry / Computer Vision Project"
                  className="w-full px-4 py-2.5 bg-[#080B11] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share details regarding your team, role, or collaboration scope..."
                  className="w-full px-4 py-2.5 bg-[#080B11] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-colors resize-y"
                />
              </div>

              {/* Status Banner */}
              {status.type && (
                <div
                  className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
                    status.type === 'success'
                      ? 'bg-[#080B11] border border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/60 border border-red-500/50 text-red-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">{status.message}</p>
                    {status.details && (
                      <p className="text-[11px] text-slate-400">{status.details}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold text-slate-950 rounded-xl transition-all shadow-lg active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: accentColors.primary,
                  boxShadow: `0 8px 24px -4px ${accentColors.glow}`,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
