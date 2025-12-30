import React, { useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { CodeModal } from './CodeModal';

interface ComponentWithCodeProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  code: string;
  language?: 'typescript' | 'tsx' | 'bash' | 'javascript';
  children: React.ReactNode;
  className?: string;
}

export function ComponentWithCode({
  title,
  description,
  badge,
  code,
  language = 'tsx',
  children,
  className,
}: ComponentWithCodeProps) {
  const [showCode, setShowCode] = useState(false);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCode) {
        setShowCode(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showCode]);

  return (
    <>
      <div className={className}>
        <div className="relative">
          {children}
          <button
            onClick={() => setShowCode(true)}
            className="group absolute -top-3 -right-3 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 text-xs font-medium text-muted-foreground focus:outline-none focus:ring-0 overflow-hidden shadow-lg border border-border/50 hover:border-primary/50 z-10"
            aria-label="Show code"
          >
            <Code2 className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          </button>
        </div>
      </div>
      <CodeModal
        code={code}
        language={language}
        isOpen={showCode}
        onClose={() => setShowCode(false)}
      />
    </>
  );
}

