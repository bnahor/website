import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIsFirstRender } from '../../hooks/useIsFirstRender';
import { profile } from '../../data/profile';
import { Icon } from '../Icon';
import { MOTION } from '../../utils/motion';

interface HeroTileProps {
  isExpanded: boolean;
}

export function HeroTile({ isExpanded }: HeroTileProps) {
  const [copied, setCopied] = useState(false);
  const [showQuickContact, setShowQuickContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const resetStatusTimeoutRef = useRef<number | null>(null);
  const submitControllerRef = useRef<AbortController | null>(null);
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      if (resetStatusTimeoutRef.current) {
        window.clearTimeout(resetStatusTimeoutRef.current);
      }
      submitControllerRef.current?.abort();
    };
  }, []);

  const handleEmailClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }, []);

  const toggleQuickContact = useCallback(() => {
    setShowQuickContact((prev) => !prev);
  }, []);

  const handleQuickContactSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(e.currentTarget);
    submitControllerRef.current?.abort();
    const controller = new AbortController();
    submitControllerRef.current = controller;
    
    try {
      const response = await fetch('https://formspree.io/f/myzdbgal', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
        if (resetStatusTimeoutRef.current) {
          window.clearTimeout(resetStatusTimeoutRef.current);
        }
        resetStatusTimeoutRef.current = window.setTimeout(() => {
          setShowQuickContact(false);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      if ((error as DOMException).name === 'AbortError') {
        return;
      }
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      submitControllerRef.current = null;
    }
  }, []);

  const contactMethods = useMemo(
    () => [
      {
        name: 'Quick Message',
        value: 'Send a message directly',
        icon: 'email' as const,
        action: toggleQuickContact,
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
    ],
    [handleEmailClick, toggleQuickContact]
  );

  return (
    <div className="flex flex-col justify-between min-h-[400px] p-4 md:p-6">
      <div className="flex-shrink-0">
        <motion.h1 
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-2"
          animate={isExpanded ? { fontSize: '3rem' } : undefined}
        >
          {profile.name}
        </motion.h1>
        <motion.p 
          className="text-text-muted leading-[1.75]"
          animate={isExpanded ? { fontSize: '1.125rem' } : undefined}
        >
          {profile.valueProp}
        </motion.p>
      </div>

      <div className="flex-1 py-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Let's Connect</h3>
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.name}
              custom={index}
              initial={isFirstRender ? false : 'hidden'}
              animate={isFirstRender ? undefined : 'show'}
              variants={MOTION.listItem}
              className="group"
            >
              <motion.button
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
                <motion.span 
                  className={`relative text-sm opacity-0 group-hover:opacity-100 transition-opacity ${
                    method.copyable && method.name === 'Email' && copied ? 'text-emerald-400' : 'text-brand'
                  }`}
                  whileHover={{ x: 5 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
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
                    </motion.span>
                  </AnimatePresence>
                </motion.span>
              </motion.button>
              
              <AnimatePresence>
                {method.name === 'Quick Message' && showQuickContact && (
                  <motion.div
                    layout
                    variants={MOTION.formSlideIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10 will-change-transform"
                  >
                  <form onSubmit={handleQuickContactSubmit} className="space-y-3">
                    <motion.input
                      name="name"
                      type="text"
                      placeholder="Your name"
                      required
                      className="w-full px-3 py-2 bg-surface border border-stroke rounded text-text-primary placeholder-text-muted text-sm focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200"
                      whileFocus={MOTION.formField.focus}
                      initial={MOTION.formField.blur}
                    />
                    <motion.input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      required
                      className="w-full px-3 py-2 bg-surface border border-stroke rounded text-text-primary placeholder-text-muted text-sm focus:ring-2 focus:ring-brand focus:border-transparent transition-all duration-200"
                      whileFocus={MOTION.formField.focus}
                      initial={MOTION.formField.blur}
                    />
                    <motion.textarea
                      name="message"
                      placeholder="Your message..."
                      rows={3}
                      required
                      className="w-full px-3 py-2 bg-surface border border-stroke rounded text-text-primary placeholder-text-muted text-sm focus:ring-2 focus:ring-brand focus:border-transparent resize-none transition-all duration-200"
                      whileFocus={MOTION.formField.focus}
                      initial={MOTION.formField.blur}
                    />
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-brand outline-none flex items-center gap-2"
                        whileHover={!isSubmitting ? MOTION.buttonHover : {}}
                        whileTap={!isSubmitting ? MOTION.tap : {}}
                      >
                        {isSubmitting && (
                          <motion.div
                            className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                            variants={MOTION.loadingSpinner}
                            animate="animate"
                          />
                        )}
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </motion.button>
                      
                      <motion.button
                        type="button"
                        onClick={() => setShowQuickContact(false)}
                        className="text-text-muted hover:text-text-primary text-sm focus-visible:ring-2 focus-visible:ring-brand outline-none rounded"
                        whileHover={MOTION.mobileHover}
                        whileTap={MOTION.tap}
                      >
                        Cancel
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {submitStatus === 'success' && (
                        <motion.div
                          className="text-green-500 text-sm flex items-center gap-2"
                          variants={MOTION.statusMessage}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                          >
                            ✓
                          </motion.span>
                          Message sent successfully!
                        </motion.div>
                      )}
                      
                      {submitStatus === 'error' && (
                        <motion.div
                          className="text-red-500 text-sm flex items-center gap-2"
                          variants={MOTION.statusMessage}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                          >
                            ✗
                          </motion.span>
                          Failed to send message. Please try email instead.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          
          <div className="flex items-center gap-2 text-sm mt-4 pt-2 border-t border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-text-muted">Available for new opportunities</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 pt-4">
        <div className="flex flex-col gap-3">
          <motion.a 
            href={profile.links.resume}
            download="rohan_bahl_resume.pdf"
            className="btn-primary text-sm px-6 py-3 inline-flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-brand outline-none"
            whileHover={MOTION.buttonHover}
            whileTap={MOTION.tap}
          >
            Download Resume
            <Icon name="arrowRight" size={16} />
          </motion.a>
        </div>
      </div>
    </div>
  );
}
