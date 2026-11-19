import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@avalanche-sdk/ui';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSnippetProps {
  code: string;
  language?: 'typescript' | 'tsx' | 'bash' | 'javascript';
  className?: string;
}

export function CodeSnippet({ 
  code, 
  language = 'typescript',
  className 
}: CodeSnippetProps) {
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

  return (
    <div className={cn('mt-4', className)}>
      <div className="relative group/code">
        <div className="flex items-start gap-3 bg-[#1e1e1e] dark:bg-[#0d1117] backdrop-blur-sm rounded-xl border border-border/50 shadow-lg overflow-hidden">
          <div className="flex-1 min-w-0 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs text-[#cccccc] mb-0 px-4 pt-4 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                {language === 'tsx' ? 'tsx' : language === 'typescript' ? 'ts' : language}
              </span>
            </div>
            <SyntaxHighlighter
              language={getLanguage()}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1rem',
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
          <button
            onClick={copyToClipboard}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 shrink-0 sticky top-0 m-2',
              'hover:scale-110 active:scale-95',
              copied
                ? 'bg-green-500/20 border-green-500 text-green-400 shadow-lg shadow-green-500/30'
                : 'bg-background/50 border-border/50 hover:bg-accent/50 hover:border-primary/50 text-muted-foreground hover:text-foreground'
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-5 h-5 animate-in zoom-in duration-200" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
        {copied && (
          <div className="absolute -top-10 right-0 bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 z-10">
            Copied!
          </div>
        )}
      </div>
    </div>
  );
}
