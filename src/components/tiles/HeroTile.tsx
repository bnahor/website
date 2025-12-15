import { m, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { profile } from '../../data/profile';
import { Icon } from '../Icon';
import { MOTION } from '../../utils/motion';
import { EXTERNAL } from '../../config/external';

interface HeroTileProps {
  isExpanded: boolean;
}

export function HeroTile({ isExpanded }: HeroTileProps) {
  const [copied, setCopied] = useState(false);
  const [showQuickContact, setShowQuickContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const handleQuickContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(e.currentTarget);

    const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000, retries = 2): Promise<Response> => {
      for (let i = 0; i <= retries; i++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          if (i === retries) throw error;
          // Exponential backoff: wait 1s, then 2s
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
      }
      throw new Error('Max retries reached');
    };

    try {
      const response = await fetchWithTimeout(EXTERNAL.FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => {
          setShowQuickContact(false);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      name: 'Quick Message',
      value: 'Send a message directly',
      icon: 'email' as const,
      action: () => setShowQuickContact(!showQuickContact),
      copyable: false
    },
    {
      name: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: 'email' as const,
      action: handleEmailClick,
      copyable: true
    },
    {
      name: 'LinkedIn',
      value: 'rohan-bahl',
      href: profile.links.linkedin,
      icon: 'briefcase' as const,
    },
    {
      name: 'GitHub',
      value: 'RB9823',
      href: profile.links.github,
      icon: 'dev' as const,
    }
  ];

  return (
    <div className="flex flex-col justify-between min-h-[400px] p-4 md:p-6">
      <div className="flex-shrink-0">
        <m.h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-2"
          animate={{
            fontSize: isExpanded ? '3rem' : undefined
          }}
          transition={{ duration: 0.3 }}
        >
          {profile.name}
        </m.h1>
        <m.p
          className="text-text-muted leading-[1.75]"
          animate={{
            fontSize: isExpanded ? '1.125rem' : '1rem'
          }}
          transition={{ duration: 0.3 }}
        >
          {profile.valueProp}
        </m.p>
      </div>

      <div className="flex-1 py-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Let's Connect</h3>
          {contactMethods.map((method) => (
            <div
              key={method.name}
              className="group"
            >
              <m.button
                onClick={method.action || (() => window.open(method.href, '_blank'))}
                className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 backdrop-brightness-[1.05] transition-all duration-200 text-left focus-visible:ring-2 focus-visible:ring-brand outline-none"
                whileHover={MOTION.mobileHover}
                whileTap={MOTION.tap}
              >
                <span className="text-brand">
                  <Icon name={method.icon} size={18} />
                </span>
                <div className="flex-1">
                  <div className="font-medium text-text-primary text-sm">
                    {method.name}
                  </div>
                  <div className="text-text-muted text-xs">
                    {method.name === 'Email' && copied ? 'Copied to clipboard!' : method.value}
                  </div>
                </div>
                <m.span
                  className={`relative text-sm opacity-0 group-hover:opacity-100 transition-opacity ${
                    method.copyable && method.name === 'Email' && copied ? 'text-emerald-400' : 'text-brand'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <m.span
                      key={method.copyable && method.name === 'Email' && copied ? 'copied' : 'default'}
                      initial={{ opacity: 0, scale: 0.8, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -4 }}
                      transition={{ duration: 0.18, ease: [0.4, 0.0, 0.2, 1] }}
                      className="inline-flex"
                    >
                      {method.copyable && method.name === 'Email' && copied ? (
                        <Icon name="check" size={14} className="text-emerald-400" />
                      ) : method.copyable ? (
                        <Icon name="clipboard" size={14} />
                      ) : (
                        <Icon name="arrowRight" size={14} />
                      )}
                    </m.span>
                  </AnimatePresence>
                </m.span>
              </m.button>
              
              <AnimatePresence>
                {method.name === 'Quick Message' && showQuickContact && (
                  <m.div
                    layout
                    variants={MOTION.formSlideIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10 will-change-transform"
                  >
                  <form onSubmit={handleQuickContactSubmit} className="space-y-3">
                    <m.input
                      name="name"
                      type="text"
                      placeholder="Your name"
                      required
                      className="w-full px-3 py-2 bg-surface border border-stroke rounded text-text-primary placeholder-text-muted text-sm focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200"
                      whileFocus={MOTION.formField.focus}
                      initial={MOTION.formField.blur}
                    />
                    <m.input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      className="w-full px-3 py-2 bg-surface border border-stroke rounded text-text-primary placeholder-text-muted text-sm focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200"
                      whileFocus={MOTION.formField.focus}
                      initial={MOTION.formField.blur}
                    />
                    <m.textarea
                      name="message"
                      placeholder="Your message..."
                      rows={3}
                      required
                      className="w-full px-3 py-2 bg-surface border border-stroke rounded text-text-primary placeholder-text-muted text-sm focus:ring-2 focus:ring-brand focus:border-transparent resize-none transition-all duration-200"
                      whileFocus={MOTION.formField.focus}
                      initial={MOTION.formField.blur}
                    />

                    <div className="flex items-center gap-2">
                      <m.button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-brand outline-none flex items-center gap-2"
                        whileHover={!isSubmitting ? MOTION.buttonHover : {}}
                        whileTap={!isSubmitting ? MOTION.tap : {}}
                      >
                        {isSubmitting && (
                          <m.div
                            className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                            variants={MOTION.loadingSpinner}
                            animate="animate"
                          />
                        )}
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </m.button>

                      <m.button
                        type="button"
                        onClick={() => setShowQuickContact(false)}
                        className="text-text-muted hover:text-text-primary text-sm focus-visible:ring-2 focus-visible:ring-brand outline-none rounded"
                        whileHover={MOTION.mobileHover}
                        whileTap={MOTION.tap}
                      >
                        Cancel
                      </m.button>
                    </div>

                    <AnimatePresence>
                      {submitStatus === 'success' && (
                        <m.div
                          className="text-green-500 text-sm flex items-center gap-2"
                          variants={MOTION.statusMessage}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <m.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                          >
                            ✓
                          </m.span>
                          Message sent successfully!
                        </m.div>
                      )}

                      {submitStatus === 'error' && (
                        <m.div
                          className="text-red-500 text-sm flex items-center gap-2"
                          variants={MOTION.statusMessage}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <m.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                          >
                            ✗
                          </m.span>
                          Failed to send message. Please try email instead.
                        </m.div>
                      )}
                    </AnimatePresence>
                  </form>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          
          <div className="flex items-center gap-2 text-sm mt-4 pt-2 border-t border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-text-muted">Available for new opportunities</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 pt-4">
        <div className="flex flex-col gap-3">
          <m.a
            href={profile.links.resume}
            download="rohan_bahl_resume.pdf"
            className="btn-primary text-sm px-6 py-3 inline-flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-brand outline-none"
            whileHover={MOTION.buttonHover}
            whileTap={MOTION.tap}
          >
            Download Resume
            <Icon name="arrowRight" size={16} />
          </m.a>
        </div>
      </div>
    </div>
  );
}
