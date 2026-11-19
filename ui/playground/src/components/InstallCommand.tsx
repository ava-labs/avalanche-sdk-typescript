import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge } from '@avalanche-sdk/ui';
import { Copy, Check, Rocket, Package } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@avalanche-sdk/ui';

interface CommandBlockProps {
  title: string;
  description: string;
  command: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

function CommandBlock({ title, description, command, badge, icon: Icon }: CommandBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="border">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl font-semibold">
                {title}
              </CardTitle>
              {badge && (
                <Badge variant="default" className="text-xs font-medium">
                  {badge}
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative group/code">
          <div className="flex items-center gap-3 bg-[#1e1e1e] dark:bg-[#0d1117] backdrop-blur-sm rounded-xl p-4 border border-border/50 shadow-lg">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-[#cccccc] mb-1.5 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Terminal
                </span>
                <span className="text-[#999999]">•</span>
                <span>bash</span>
              </div>
              <code className="flex items-center gap-2 text-sm font-mono text-[#d4d4d4] select-all break-all">
                <span className="text-[#569cd6]">npm</span>
                {' '}
                {command.includes('create') ? (
                  <>
                    <span className="text-[#dcdcaa]">create</span>
                    {' '}
                    <span className="text-[#4ec9b0]">avalanche</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#dcdcaa]">install</span>
                    {' '}
                    <span className="text-[#ce9178]">@avalanche-sdk/ui</span>
                  </>
                )}
              </code>
            </div>
            <button
              onClick={copyToClipboard}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 shrink-0',
                'hover:scale-110 active:scale-95',
                copied
                  ? 'bg-green-500/20 border-green-500 text-green-400 shadow-lg shadow-green-500/30'
                  : 'bg-background/50 border-border/50 hover:bg-accent/50 hover:border-primary/50 text-muted-foreground hover:text-foreground'
              )}
              aria-label="Copy command"
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
      </CardContent>
    </Card>
  );
}

export function InstallCommand() {
  return (
    <div className="space-y-4">
      <CommandBlock
        title="Create New Project"
        description="Bootstrap a Next.js application with Avalanche SDK pre-configured"
        command="npm create avalanche"
        badge="Recommended"
        icon={Rocket}
      />
      <CommandBlock
        title="Install UI Package"
        description="Add Avalanche UI Kit to your existing project"
        command="npm install @avalanche-sdk/ui"
        icon={Package}
      />
    </div>
  );
}

