import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { cn } from '@avalanche-sdk/ui';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeModalProps {
  code: string;
  language?: 'typescript' | 'tsx' | 'bash' | 'javascript';
  isOpen: boolean;
  onClose: () => void;
}

export function CodeModal({ 
  code, 
  language = 'typescript',
  isOpen,
  onClose
}: CodeModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Map language to syntax highlighter language
  const getLanguage = () => {
    switch (language) {
      case 'tsx':
        return 'tsx';
      case 'typescript':
        return 'typescript';
      case 'bash':
        return 'bash';
      case 'javascript':
        return 'javascript';
      default:
        return 'typescript';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={cn(
          'relative w-full max-w-4xl max-h-[90vh] bg-background rounded-xl border border-border shadow-2xl',
          'flex flex-col overflow-hidden'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {language === 'tsx' ? 'tsx' : language === 'typescript' ? 'ts' : language}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200',
                'hover:scale-110 active:scale-95',
                copied
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'bg-background border-border hover:bg-accent text-muted-foreground hover:text-foreground'
              )}
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto bg-[#1e1e1e] dark:bg-[#0d1117]">
          <SyntaxHighlighter
            language={getLanguage()}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'transparent',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
            codeTagProps={{
              style: {
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
              }
            }}
            showLineNumbers
            lineNumberStyle={{
              minWidth: '2em',
              paddingRight: '1em',
              color: '#858585',
              userSelect: 'none',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Press ESC to close
          </p>
        </div>
      </div>
    </div>
  );
}

