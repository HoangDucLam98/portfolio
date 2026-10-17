import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Send, Mail, MapPin, Sparkles, CheckCircle2, MessageSquare, ArrowUp, Code2, Globe, Share2, FileDown } from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import { soundManager } from '../../audio/audioEngine';

const cvUrl = `${import.meta.env.BASE_URL || '/'}HoangDucLam_CV.pdf`;

interface ContactOverlayProps {
  isSubmitting: boolean;
  setIsSubmitting: (state: boolean) => void;
  isSuccess: boolean;
  setIsSuccess: (state: boolean) => void;
  setIsFocused: (state: boolean) => void;
  onScrollToTop: () => void;
}

export function ContactOverlay({
  isSubmitting,
  setIsSubmitting,
  isSuccess,
  setIsSuccess,
  setIsFocused,
  onScrollToTop,
}: ContactOverlayProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [usedMailtoFallback, setUsedMailtoFallback] = useState(false);

  const celebrateDispatch = () => {
    setIsSuccess(true);
    soundManager.playSuccess();

    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8da178', '#ffd166', '#ff9e80', '#70b0d0', '#c68b59'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setSubmitError('Please fill in your name, email, and message before dispatching.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitError('That email address does not look right. Please double-check it.');
      return;
    }

    if (honeypot) {
      celebrateDispatch();
      return;
    }

    soundManager.playClick();
    setIsSubmitting(true);

    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            subject: subject || `Quest proposal from ${name}`,
            message,
            _subject: `[Portfolio] ${subject || `Quest proposal from ${name}`}`,
            _gotcha: honeypot,
          }),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        setUsedMailtoFallback(false);
      } else {
        const mailSubject = encodeURIComponent(subject || `Quest proposal from ${name}`);
        const mailBody = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        window.location.href = `mailto:${personalInfo.socials.email}?subject=${mailSubject}&body=${mailBody}`;
        setUsedMailtoFallback(true);
      }

      celebrateDispatch();
    } catch {
      setSubmitError(
        `The carrier pigeon got lost in the clouds. Please try again, or email me directly at ${personalInfo.socials.email}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { socials } = personalInfo;

  type SocialLink = { key: string; label: string; href: string; icon: React.ReactNode };

  const socialLinks: SocialLink[] = [];
  if (socials.github) {
    socialLinks.push({
      key: 'github',
      label: 'GitHub',
      href: socials.github,
      icon: <Code2 className="w-4 h-4 text-[#8da178]" />,
    });
  }
  if (socials.linkedin) {
    socialLinks.push({
      key: 'linkedin',
      label: 'LinkedIn',
      href: socials.linkedin,
      icon: <Globe className="w-4 h-4 text-[#70b0d0]" />,
    });
  }
  if (socials.twitter) {
    socialLinks.push({
      key: 'twitter',
      label: 'Twitter / X',
      href: socials.twitter,
      icon: <Share2 className="w-4 h-4 text-[#ffd166]" />,
    });
  }
  if (socials.discord) {
    socialLinks.push({
      key: 'discord',
      label: 'Discord',
      href: socials.discord,
      icon: <MessageSquare className="w-4 h-4 text-[#ff9e80]" />,
    });
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-12 px-6 sm:px-12 max-w-7xl mx-auto pointer-events-none"
    >
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white border-2 border-[#e6d8cb] text-xs font-heading font-bold text-[#526545] mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STATION 05 // COZY CAMPFIRE BEACON</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#38271e] tracking-tight">
          DISPATCH{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8da178] via-[#e76f51] to-[#f4a261]">
            QUEST LETTER
          </span>
        </h2>
        <p className="text-sm text-[#5c4a3f] mt-2 font-medium">
          Have an exciting indie game project, physics challenge, or studio opportunity? Pull up a log by the campfire.
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">
        {/* Left: Contact Form (7 cols) */}
        <div className="lg:col-span-7 pointer-events-auto">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel-glow border-2 border-[#8da178] shadow-xl bg-white/95">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#8da178]/20 border-2 border-[#8da178] flex items-center justify-center text-[#8da178] shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#38271e]">
                  Carrier Pigeon Dispatched!
                </h3>
                <p className="text-sm sm:text-base text-[#5c4a3f] max-w-md font-medium leading-relaxed">
                  {usedMailtoFallback
                    ? 'Your email app should have opened with the quest proposal pre-filled — just press send and it will reach Hoang Duc Lam.'
                    : 'Your quest proposal has been sealed and delivered to Hoang Duc Lam. Expect a friendly reply within 24 hours.'}
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setUsedMailtoFallback(false);
                    setSubmitError(null);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-2xl bg-[#f4ebe1] hover:bg-[#e6d8cb] text-xs font-heading font-bold text-[#38271e] border border-[#e6d8cb] cursor-pointer shadow-sm"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="_gotcha"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#786558] uppercase mb-1.5">
                      Adventurer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Robin of Skyward"
                      className="w-full px-4 py-3 rounded-2xl bg-[#fbf4eb] border-2 border-[#e6d8cb] focus:border-[#8da178] text-[#38271e] text-xs sm:text-sm font-medium outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-[#786558] uppercase mb-1.5">
                      Scroll / Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="robin@indiegames.io"
                      className="w-full px-4 py-3 rounded-2xl bg-[#fbf4eb] border-2 border-[#e6d8cb] focus:border-[#8da178] text-[#38271e] text-xs sm:text-sm font-medium outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#786558] uppercase mb-1.5">
                    Quest Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. 3D Cel-Shader Collaboration"
                    className="w-full px-4 py-3 rounded-2xl bg-[#fbf4eb] border-2 border-[#e6d8cb] focus:border-[#8da178] text-[#38271e] text-xs sm:text-sm font-medium outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#786558] uppercase mb-1.5">
                    Quest Message Payload *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your game concept, timeline, or art direction..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#fbf4eb] border-2 border-[#e6d8cb] focus:border-[#8da178] text-[#38271e] text-xs sm:text-sm font-medium outline-none transition-colors resize-none"
                  />
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="text-xs text-[#e76f51] font-heading font-bold bg-[#ff9e80]/10 border border-[#ff9e80]/40 rounded-2xl px-4 py-3"
                  >
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#4a332d] hover:bg-[#38271e] text-white font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Carrier Pigeon...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#ffd166]" />
                      <span>Dispatch Quest Letter</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Studio Coordinates & Socials (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 pointer-events-auto">
          {/* Coordinates Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-2 border-[#e6d8cb] flex flex-col gap-4 bg-white/95 shadow-md">
            <h3 className="text-xs font-heading font-extrabold text-[#526545] uppercase tracking-widest">
              STUDIO COORDINATES
            </h3>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#38271e]">
              <Mail className="w-4 h-4 text-[#8da178] shrink-0" />
              <a
                href={`mailto:${personalInfo.socials.email}`}
                className="hover:text-[#e76f51] transition-colors font-mono font-bold"
              >
                {personalInfo.socials.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm text-[#38271e]">
              <MapPin className="w-4 h-4 text-[#e76f51] shrink-0" />
              <span className="font-mono">{personalInfo.location}</span>
            </div>

            <a
              href={cvUrl}
              download="HoangDucLam_CV.pdf"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-3 text-xs sm:text-sm text-[#38271e] hover:text-[#8da178] transition-colors font-mono font-bold"
            >
              <FileDown className="w-4 h-4 text-[#70b0d0] shrink-0" />
              <span>Download Resume (PDF)</span>
            </a>
          </div>

          {/* Social Matrix */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-2 border-[#e6d8cb] flex flex-col gap-4 bg-white/95 shadow-md">
            <h3 className="text-xs font-heading font-extrabold text-[#bc4b2d] uppercase tracking-widest">
              GUILD CHANNELS
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#fbf4eb] hover:bg-[#f4ebe1] border border-[#e6d8cb] text-xs font-heading font-bold text-[#38271e] transition-colors shadow-sm"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full pt-8 border-t-2 border-[#e6d8cb] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#786558] pointer-events-auto">
        <div>
          © {new Date().getFullYear()} Sproutling Games // Hoang Duc Lam. Crafted with React 19, Three.js & Wholesome Vibes.
        </div>

        <button
          onClick={() => {
            soundManager.playWhoosh();
            onScrollToTop();
          }}
          className="flex items-center gap-1.5 font-heading font-bold text-[#a63e24] hover:text-[#38271e] transition-colors cursor-pointer"
        >
          <span>RETURN TO STUDIO</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </footer>
    </section>
  );
}
