'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PortfolioTheme, Portfolio } from '@/types';

export interface ThemeSettings {
  lightDark?: 'light' | 'dark' | 'system';
  backgroundEffects?: boolean;
  accentColor?: string;
  fontStyle?: string;
  borderRadius?: string;
  animationLevel?: 'none' | 'low' | 'high';
}

export interface ThemeTokens {
  bodyClass: string;
  containerClass: string;
  cardClass: string;
  headingClass: string;
  textMutedClass: string;
  buttonAccentClass: string;
  buttonSecondaryClass: string;
  accentHex: string;
  fontFamilyClass: string;
  borderRadiusClass: string;
  navClass: string;
  navTextClass: string;
  footerClass: string;
  badgeClass: string;
  sectionHeaderClass: string;
  inputClass: string;
}

interface ThemeContextType {
  theme: PortfolioTheme;
  settings: ThemeSettings;
  tokens: ThemeTokens;
  setTheme: (theme: PortfolioTheme) => void;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_PRESETS: Record<Exclude<PortfolioTheme, 'portfolio-os'>, {
  name: string;
  description: string;
  accentHex: string;
  fontStyle: string;
  borderRadius: string;
  animationLevel: 'none' | 'low' | 'high';
  tokens: ThemeTokens;
}> = {
  'developer-pro': {
    name: 'Developer Pro',
    description: 'Dark, technical and sleek portfolio presentation for engineers.',
    accentHex: '#14b8a6', // Teal
    fontStyle: 'font-sans', // Inter
    borderRadius: 'rounded-xl',
    animationLevel: 'high',
    tokens: {
      bodyClass: 'bg-[#0a0b0d] text-zinc-300 font-sans antialiased selection:bg-teal-500/20',
      containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      cardClass: 'bg-zinc-900/40 border border-zinc-800/80 hover:border-teal-500/20 backdrop-blur-md shadow-lg transition-all duration-300',
      headingClass: 'text-white font-extrabold tracking-tight',
      textMutedClass: 'text-zinc-500',
      buttonAccentClass: 'bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold shadow-md transition-all',
      buttonSecondaryClass: 'bg-zinc-900/50 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 transition-all',
      accentHex: '#14b8a6',
      fontFamilyClass: 'font-sans',
      borderRadiusClass: 'rounded-xl',
      navClass: 'bg-[#0a0b0d]/80 border-b border-zinc-900 backdrop-blur-md',
      navTextClass: 'text-zinc-100 hover:text-teal-400',
      footerClass: 'bg-[#0a0b0d] border-t border-zinc-900 text-zinc-500',
      badgeClass: 'bg-teal-500/10 border border-teal-500/20 text-teal-400',
      sectionHeaderClass: 'text-zinc-200 border-b border-zinc-800/60 pb-2 text-xs font-semibold uppercase tracking-wider',
      inputClass: 'bg-zinc-950 border border-zinc-850 text-white focus:border-teal-500 rounded-lg outline-none',
    }
  },
  'executive': {
    name: 'Executive',
    description: 'Light, elegant corporate design layout with balanced white space.',
    accentHex: '#2563eb', // Blue
    fontStyle: 'font-sans', // SF Pro Style / Inter
    borderRadius: 'rounded-lg',
    animationLevel: 'low',
    tokens: {
      bodyClass: 'bg-slate-50 text-slate-700 font-sans antialiased selection:bg-blue-500/10',
      containerClass: 'max-w-6xl mx-auto px-6 lg:px-8',
      cardClass: 'bg-white border border-slate-200/80 hover:border-blue-500/20 hover:shadow-md transition-all duration-300 shadow-sm',
      headingClass: 'text-slate-900 font-semibold tracking-tight',
      textMutedClass: 'text-slate-400',
      buttonAccentClass: 'bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all',
      buttonSecondaryClass: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all',
      accentHex: '#2563eb',
      fontFamilyClass: 'font-sans',
      borderRadiusClass: 'rounded-lg',
      navClass: 'bg-white/80 border-b border-slate-200 backdrop-blur-md',
      navTextClass: 'text-slate-800 hover:text-blue-650',
      footerClass: 'bg-white border-t border-slate-200 text-slate-400',
      badgeClass: 'bg-blue-50 border border-blue-200/50 text-blue-600',
      sectionHeaderClass: 'text-slate-800 border-b border-slate-200 pb-2 text-xs font-semibold uppercase tracking-wider',
      inputClass: 'bg-white border border-slate-200 text-slate-900 focus:border-blue-650 rounded-lg outline-none',
    }
  },
  'creative': {
    name: 'Creative',
    description: 'Vibrant colors, dark backdrop-glassmorphism, and smooth transitions.',
    accentHex: '#c084fc', // Purple
    fontStyle: 'font-sans', // Satoshi / Outfit
    borderRadius: 'rounded-2xl',
    animationLevel: 'high',
    tokens: {
      bodyClass: 'bg-gradient-to-br from-[#0c051e] via-[#050212] to-[#1a001a] text-purple-200 font-sans antialiased selection:bg-purple-500/30 min-h-screen',
      containerClass: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      cardClass: 'bg-white/[0.03] backdrop-blur-lg border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.05] shadow-2xl transition-all duration-500',
      headingClass: 'text-white font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-300',
      textMutedClass: 'text-purple-400/60',
      buttonAccentClass: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-extrabold shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02]',
      buttonSecondaryClass: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all',
      accentHex: '#c084fc',
      fontFamilyClass: 'font-sans',
      borderRadiusClass: 'rounded-2xl',
      navClass: 'bg-[#050212]/70 border-b border-white/5 backdrop-blur-lg',
      navTextClass: 'text-purple-100 hover:text-purple-400',
      footerClass: 'bg-[#050212] border-t border-white/5 text-purple-400/50',
      badgeClass: 'bg-purple-500/10 border border-purple-500/20 text-purple-300',
      sectionHeaderClass: 'text-purple-100 border-b border-purple-900/30 pb-2 text-xs font-semibold uppercase tracking-wider',
      inputClass: 'bg-white/5 border border-white/10 text-white focus:border-purple-500 rounded-xl outline-none',
    }
  },
  'terminal': {
    name: 'Terminal',
    description: 'Classic code console style layout with green text and blinking cursor.',
    accentHex: '#22c55e', // Green
    fontStyle: 'font-mono', // JetBrains Mono
    borderRadius: 'rounded-none',
    animationLevel: 'none',
    tokens: {
      bodyClass: 'bg-black text-green-400 font-mono antialiased selection:bg-green-500/30',
      containerClass: 'max-w-5xl mx-auto px-4',
      cardClass: 'bg-black border border-green-500/30 hover:border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.05)] transition-all duration-200',
      headingClass: 'text-green-500 font-bold tracking-tight uppercase font-mono',
      textMutedClass: 'text-zinc-600',
      buttonAccentClass: 'bg-green-500 hover:bg-green-400 text-black font-bold border border-green-500 transition-all',
      buttonSecondaryClass: 'bg-black hover:bg-green-950/20 text-green-500 border border-green-500/30 transition-all',
      accentHex: '#22c55e',
      fontFamilyClass: 'font-mono',
      borderRadiusClass: 'rounded-none',
      navClass: 'bg-black border-b border-green-500/20',
      navTextClass: 'text-green-400 hover:text-green-300',
      footerClass: 'bg-black border-t border-green-500/20 text-zinc-600',
      badgeClass: 'bg-green-950/30 border border-green-500/30 text-green-400',
      sectionHeaderClass: 'text-green-500 border-b border-green-500/20 pb-2 text-xs font-bold uppercase tracking-wider font-mono',
      inputClass: 'bg-black border border-green-500/30 text-green-400 focus:border-green-400 rounded-none outline-none font-mono',
    }
  }
};

export function ThemeProvider({
  children,
  portfolio
}: {
  children: React.ReactNode;
  portfolio: Portfolio | null;
}) {
  // Backward compatibility alias resolve: 'portfolio-os' defaults to 'developer-pro'
  const rawTheme = portfolio?.theme || 'developer-pro';
  const initialTheme = (rawTheme === 'portfolio-os' ? 'developer-pro' : rawTheme) as Exclude<PortfolioTheme, 'portfolio-os'>;

  const [theme, setTheme] = useState<Exclude<PortfolioTheme, 'portfolio-os'>>(initialTheme);
  const [settings, setSettings] = useState<ThemeSettings>({});

  // Sync settings when portfolio changes
  useEffect(() => {
    if (portfolio) {
      const currentRaw = portfolio.theme || 'developer-pro';
      const cleanTheme = (currentRaw === 'portfolio-os' ? 'developer-pro' : currentRaw) as Exclude<PortfolioTheme, 'portfolio-os'>;
      setTheme(cleanTheme);
      setSettings({
        accentColor: portfolio.accentColor,
        fontStyle: portfolio.fontStyle,
        borderRadius: portfolio.borderRadius,
        animationLevel: portfolio.animationLevel as any,
        lightDark: portfolio.themeSettings?.lightDark || 'dark',
        backgroundEffects: portfolio.themeSettings?.backgroundEffects !== false
      });
    }
  }, [portfolio]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Generate dynamic customized tokens
  const basePreset = THEME_PRESETS[theme] || THEME_PRESETS['developer-pro'];
  const activeTokens = { ...basePreset.tokens };

  // Override accent color hex
  const activeAccentHex = settings.accentColor || basePreset.accentHex;
  activeTokens.accentHex = activeAccentHex;

  // Apply font override
  const fontStyle = settings.fontStyle || basePreset.fontStyle;
  if (fontStyle === 'font-sans') {
    activeTokens.fontFamilyClass = 'font-sans';
  } else if (fontStyle === 'font-mono') {
    activeTokens.fontFamilyClass = 'font-mono';
  } else if (fontStyle === 'font-serif') {
    activeTokens.fontFamilyClass = 'font-serif';
  }

  // Apply border radius override
  const radius = settings.borderRadius || basePreset.borderRadius;
  const radiusMap: Record<string, string> = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'full': 'rounded-2xl',
  };
  const activeRadiusClass = radiusMap[radius] || radius;
  activeTokens.borderRadiusClass = activeRadiusClass;

  // Re-map border-radius to card tokens
  if (radius) {
    const cleanRadius = radiusMap[radius] || radius;
    activeTokens.cardClass = activeTokens.cardClass.replace(/rounded-[a-z0-9-]+/g, cleanRadius);
    activeTokens.buttonAccentClass = activeTokens.buttonAccentClass.replace(/rounded-[a-z0-9-]+/g, cleanRadius);
    activeTokens.buttonSecondaryClass = activeTokens.buttonSecondaryClass.replace(/rounded-[a-z0-9-]+/g, cleanRadius);
    activeTokens.inputClass = activeTokens.inputClass.replace(/rounded-[a-z0-9-]+/g, cleanRadius);
  }

  // Custom typography loader if serif
  if (fontStyle === 'font-serif') {
    activeTokens.bodyClass = activeTokens.bodyClass.replace(/font-[a-z-]+/g, 'font-serif');
  } else if (fontStyle === 'font-mono') {
    activeTokens.bodyClass = activeTokens.bodyClass.replace(/font-[a-z-]+/g, 'font-mono');
  } else if (fontStyle === 'font-sans') {
    activeTokens.bodyClass = activeTokens.bodyClass.replace(/font-[a-z-]+/g, 'font-sans');
  }

  // Inject font variables inside layout
  useEffect(() => {
    const root = document.documentElement;
    if (activeAccentHex) {
      root.style.setProperty('--accent-color', activeAccentHex);
    }
  }, [activeAccentHex]);

  return (
    <ThemeContext.Provider value={{
      theme,
      settings,
      tokens: activeTokens,
      setTheme: (t) => setTheme(t === 'portfolio-os' ? 'developer-pro' : t),
      updateSettings
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
