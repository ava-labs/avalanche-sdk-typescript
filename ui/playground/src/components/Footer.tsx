import React from 'react';
import { Github, ExternalLink, BookOpen, Code, Zap, Shield } from 'lucide-react';
import { AvalancheLogo } from '@avalanche-sdk/ui';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    resources: [
      {
        label: 'GitHub Repository',
        href: 'https://github.com/ava-labs/avalanche-sdk-typescript',
        icon: Github,
      },
      {
        label: 'Documentation',
        href: 'https://docs.avax.network',
        icon: BookOpen,
      },
      {
        label: 'Avalanche Network',
        href: 'https://avax.network',
        icon: ExternalLink,
      },
    ],
    development: [
      {
        label: 'API Reference',
        href: 'https://github.com/ava-labs/avalanche-sdk-typescript',
        icon: Code,
      },
      {
        label: 'Examples',
        href: 'https://github.com/ava-labs/avalanche-sdk-typescript/tree/main/examples',
        icon: Zap,
      },
      {
        label: 'Security',
        href: 'https://github.com/ava-labs/avalanche-sdk-typescript/security',
        icon: Shield,
      },
    ],
  };

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <AvalancheLogo size={32} className="text-primary" />
              <span className="text-lg font-bold text-foreground">Avalanche SDK</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              TypeScript SDK for building on Avalanche. Explore components, 
              integrate wallets, and interact with the blockchain.
            </p>
            <div className="flex items-center gap-3">
                <a
                  href="https://github.com/ava-labs/avalanche-sdk-typescript"
                  target="_blank"
                  rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent hover:bg-accent/80 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
                >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                <a
                      href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                >
                      <Icon className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity ml-auto" />
                </a>
              </li>
                );
              })}
            </ul>
          </div>

          {/* Development */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">
              Development
            </h3>
            <ul className="space-y-3">
              {footerLinks.development.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                <a
                      href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 group"
                >
                      <Icon className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity ml-auto" />
                </a>
              </li>
                );
              })}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-base">
              Built With
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                React & TypeScript
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Vite
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Open Source
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Avalanche SDK TypeScript. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/ava-labs/avalanche-sdk-typescript/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                License
              </a>
              <a
                href="https://github.com/ava-labs/avalanche-sdk-typescript/blob/main/CODE_OF_CONDUCT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Code of Conduct
              </a>
              <a
                href="https://github.com/ava-labs/avalanche-sdk-typescript/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contributing
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
