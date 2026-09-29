import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Palette, 
  Wallet, 
  Coins, 
  Settings, 
  ArrowRightLeft, 
  MessageSquare, 
  TrendingUp,
  ArrowUp,
  Rocket,
  DollarSign,
  HandCoins
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationSidebarProps {
  className?: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'install-command', label: 'Get Started', icon: Rocket },
  { id: 'theme-showcase', label: 'Design System', icon: Palette },
  { id: 'wallet-components', label: 'Wallet Integration', icon: Wallet },
  { id: 'chain-balances', label: 'Chain Balances', icon: HandCoins },
  { id: 'provider-config', label: 'Provider Config', icon: Settings },
  { id: 'transfer-components', label: 'Transfers', icon: ArrowRightLeft },
  { id: 'icm-components', label: 'Interchain Messaging', icon: MessageSquare },
  { id: 'staking-components', label: 'Staking', icon: TrendingUp },
  { id: 'earn-components', label: 'Earn (AAVE & Benqi)', icon: DollarSign },
];

export function NavigationSidebar({ className = '' }: NavigationSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>('install-command');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      // Update active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navigationItems[i].id);
          break;
        }
      }

      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 180;
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
    <nav 
        className={`navigation-sidebar fixed left-0 top-0 w-80 h-screen bg-card/95 backdrop-blur-sm border-r border-border z-40 overflow-y-auto ${className}`}
      style={{ paddingTop: '180px' }}
    >
      <div className="p-6">
          {/* Navigation Header */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Quick Navigation
          </h3>
            <p className="text-xs text-muted-foreground">
              Jump to any section
            </p>
        </div>

          {/* Navigation Items */}
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = activeSection === item.id;
              const Icon = item.icon;
              
            return (
              <li key={item.id}>
                <button
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 group ${
                    isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                  onClick={() => scrollToSection(item.id)}
                >
                    <Icon 
                      className={`h-4 w-4 transition-transform ${
                        isActive ? 'scale-110' : 'group-hover:scale-105'
                      }`} 
                    />
                    <span className="flex-1">{item.label}</span>
                  {isActive && (
                      <ChevronRight className="h-4 w-4 opacity-70 animate-in slide-in-from-right-2" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

          {/* Scroll to Top Button */}
          {showScrollTop && (
            <div className="mt-8 pt-6 border-t border-border">
              <button
                onClick={scrollToTop}
                className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 flex items-center justify-center gap-2 group"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>Back to Top</span>
              </button>
            </div>
          )}
      </div>
    </nav>

      {/* Mobile Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 lg:hidden z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
