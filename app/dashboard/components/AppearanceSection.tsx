'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { Portfolio, Project, Experience, Skill, Certification } from '@/types';
import { Save, Loader2, CheckCircle, Palette, Type, Layout, Square, Play, Moon, Sun, Monitor } from 'lucide-react';
import { THEME_PRESETS, ThemeTokens } from '@/components/theme/ThemeProvider';

// Import preset type safely
type PresetThemeType = 'developer-pro' | 'executive' | 'creative' | 'terminal';

interface AppearanceSectionProps {
  portfolioSettings: Portfolio | undefined;
  refetchPortfolio: () => void;
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  certifications: Certification[];
}

export default function AppearanceSection({
  portfolioSettings,
  refetchPortfolio,
  projects,
  experiences,
  skills,
  certifications
}: AppearanceSectionProps) {
  const queryClient = useQueryClient();

  // Local theme states
  const [selectedTheme, setSelectedTheme] = useState<PresetThemeType>('developer-pro');
  const [accentColor, setAccentColor] = useState('#14b8a6');
  const [fontStyle, setFontStyle] = useState('font-sans');
  const [borderRadius, setBorderRadius] = useState('rounded-xl');
  const [animationLevel, setAnimationLevel] = useState<'none' | 'low' | 'high'>('high');
  const [lightDark, setLightDark] = useState<'light' | 'dark' | 'system'>('dark');
  const [backgroundEffects, setBackgroundEffects] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync settings when loaded
  useEffect(() => {
    if (portfolioSettings) {
      const currentRaw = portfolioSettings.theme || 'developer-pro';
      const cleanTheme = (currentRaw === 'portfolio-os' ? 'developer-pro' : currentRaw) as PresetThemeType;
      setSelectedTheme(cleanTheme);
      setAccentColor(portfolioSettings.accentColor || '#14b8a6');
      setFontStyle(portfolioSettings.fontStyle || 'font-sans');
      setBorderRadius(portfolioSettings.borderRadius || 'rounded-xl');
      setAnimationLevel((portfolioSettings.animationLevel as any) || 'high');
      setLightDark(portfolioSettings.themeSettings?.lightDark || 'dark');
      setBackgroundEffects(portfolioSettings.themeSettings?.backgroundEffects !== false);
    }
  }, [portfolioSettings]);

  // Set preset defaults when theme card is clicked
  const handleSelectTheme = (themeKey: PresetThemeType) => {
    setSelectedTheme(themeKey);
    const preset = THEME_PRESETS[themeKey];
    if (preset) {
      setAccentColor(preset.accentHex);
      setFontStyle(preset.fontStyle);
      setBorderRadius(preset.borderRadius);
      setAnimationLevel(preset.animationLevel);
      if (themeKey === 'executive') {
        setLightDark('light');
      } else {
        setLightDark('dark');
      }
    }
  };

  const updateAppearanceMutation = useMutation({
    mutationFn: async (payload: Partial<Portfolio>) => {
      const res = await apiFetch('/portfolios/me', {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['portfolio-settings'] });
      refetchPortfolio();
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppearanceMutation.mutate({
      theme: selectedTheme,
      accentColor,
      fontStyle,
      borderRadius,
      animationLevel,
      themeSettings: {
        lightDark,
        backgroundEffects
      }
    });
  };

  // Generate local tokens for preview box based on current input values
  const getPreviewTokens = (): ThemeTokens => {
    const basePreset = THEME_PRESETS[selectedTheme] || THEME_PRESETS['developer-pro'];
    const previewTokens = { ...basePreset.tokens };

    previewTokens.accentHex = accentColor;
    previewTokens.fontFamilyClass = fontStyle;
    previewTokens.borderRadiusClass = borderRadius;

    // Apply radius mapping
    const radiusMap: Record<string, string> = {
      'none': 'rounded-none',
      'sm': 'rounded-sm',
      'md': 'rounded-md',
      'lg': 'rounded-lg',
      'full': 'rounded-2xl',
    };
    const cleanRadius = radiusMap[borderRadius] || borderRadius;
    previewTokens.cardClass = previewTokens.cardClass.replace(/rounded-[a-z0-9-]+/g, cleanRadius);
    previewTokens.buttonAccentClass = previewTokens.buttonAccentClass.replace(/rounded-[a-z0-9-]+/g, cleanRadius);
    previewTokens.buttonSecondaryClass = previewTokens.buttonSecondaryClass.replace(/rounded-[a-z0-9-]+/g, cleanRadius);
    previewTokens.borderRadiusClass = cleanRadius;

    return previewTokens;
  };

  const tokens = getPreviewTokens();

  const colorPresets = [
    { name: 'Teal', hex: '#14b8a6' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Purple', hex: '#c084fc' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Rose', hex: '#f43f5e' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* Settings Control Panel */}
        <div className="xl:col-span-3 space-y-6">
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md space-y-6">
            <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white font-sans">Theme Customizer</h2>
                <p className="text-xs text-zinc-500 font-sans">Choose your portfolio layout theme and tweak options.</p>
              </div>
              {saveSuccess && (
                <span className="text-xs text-teal-400 font-semibold font-mono flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Theme applied successfully!</span>
                </span>
              )}
            </div>

            {/* 1. Theme Preset Selection Cards */}
            <div className="space-y-3">
              <label className="block text-xs text-zinc-400 font-mono uppercase tracking-wider font-bold">1. Select Layout Theme</label>
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(THEME_PRESETS) as PresetThemeType[]).map((themeKey) => {
                  const preset = THEME_PRESETS[themeKey];
                  const isSelected = selectedTheme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => handleSelectTheme(themeKey)}
                      className={`relative flex flex-col items-start p-4 text-left border rounded-xl transition-all duration-300 ${
                        isSelected 
                          ? 'bg-zinc-900/60 border-teal-500/40 shadow-lg shadow-teal-500/5' 
                          : 'bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/35 hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-white">{preset.name}</span>
                        <div 
                          className="h-3.5 w-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: preset.accentHex }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-2 leading-relaxed">{preset.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Color Tweaks */}
            <div className="space-y-3">
              <label className="block text-xs text-zinc-400 font-mono uppercase tracking-wider font-bold">2. Accent Color</label>
              <div className="flex flex-wrap items-center gap-3">
                {colorPresets.map(preset => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setAccentColor(preset.hex)}
                    className="h-7 w-7 rounded-full flex items-center justify-center border border-white/10 hover:scale-105 transition-transform"
                    style={{ backgroundColor: preset.hex }}
                    title={preset.name}
                  >
                    {accentColor === preset.hex && (
                      <span className="text-[10px] text-white font-bold font-mono">✓</span>
                    )}
                  </button>
                ))}
                <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 rounded-lg px-3 py-1.5 ml-2">
                  <Palette className="h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="color"
                    value={accentColor}
                    onChange={e => setAccentColor(e.target.value)}
                    className="h-4 w-6 bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-[10px] text-zinc-300 font-mono uppercase">{accentColor}</span>
                </div>
              </div>
            </div>

            {/* 3. Typography & Sizing */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">3. Typography Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Sans / Elegant', value: 'font-sans' },
                    { label: 'Serif / Classic', value: 'font-serif' },
                    { label: 'Mono / Code', value: 'font-mono' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFontStyle(opt.value)}
                      className={`text-[10px] py-2 border rounded-lg font-semibold font-mono text-center ${
                        fontStyle === opt.value
                          ? 'bg-zinc-900 border-teal-500/30 text-teal-400'
                          : 'bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/30 text-zinc-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">4. Border Corner Radius</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { label: 'Sharp', value: 'none' },
                    { label: 'SM', value: 'sm' },
                    { label: 'MD', value: 'md' },
                    { label: 'LG', value: 'lg' },
                    { label: 'Curved', value: 'full' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBorderRadius(opt.value)}
                      className={`text-[9px] py-2 border rounded-lg font-semibold text-center ${
                        borderRadius === opt.value
                          ? 'bg-zinc-900 border-teal-500/30 text-teal-400'
                          : 'bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/30 text-zinc-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Motion & Animation */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">5. Animation Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'None', value: 'none' },
                    { label: 'Low', value: 'low' },
                    { label: 'High', value: 'high' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAnimationLevel(opt.value as any)}
                      className={`text-[10px] py-2 border rounded-lg font-semibold font-mono text-center ${
                        animationLevel === opt.value
                          ? 'bg-zinc-900 border-teal-500/30 text-teal-400'
                          : 'bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/30 text-zinc-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 font-mono mb-1.5 uppercase font-bold">6. Mode Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Light', value: 'light', icon: <Sun className="h-3 w-3" /> },
                    { label: 'Dark', value: 'dark', icon: <Moon className="h-3 w-3" /> },
                    { label: 'System', value: 'system', icon: <Monitor className="h-3 w-3" /> }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setLightDark(opt.value as any)}
                      className={`text-[10px] py-2 border rounded-lg font-semibold flex items-center justify-center gap-1.5 ${
                        lightDark === opt.value
                          ? 'bg-zinc-900 border-teal-500/30 text-teal-400'
                          : 'bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/30 text-zinc-400'
                      }`}
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Additional Effects */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={backgroundEffects}
                  onChange={e => setBackgroundEffects(e.target.checked)}
                  className="rounded border-zinc-800 bg-zinc-950 text-teal-500 focus:ring-teal-500"
                />
                <span>Enable Layout Background Glow / Particle Effects</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={updateAppearanceMutation.isPending}
              className="inline-flex items-center space-x-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 px-6 py-2.5 text-xs font-mono font-bold transition-all shadow-md w-full justify-center"
            >
              {updateAppearanceMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{updateAppearanceMutation.isPending ? 'Applying changes...' : 'Save Appearance Profile'}</span>
            </button>
          </div>
        </div>

        {/* Live Mock Screen Viewport Preview */}
        <div className="xl:col-span-2 space-y-4">
          <div className="text-zinc-400 font-mono text-xs uppercase tracking-wider font-bold">// Dynamic Layout Live Preview</div>
          
          <div className="border border-zinc-850 bg-black/60 rounded-xl overflow-hidden shadow-2xl relative">
            
            {/* Header simulated bar */}
            <div className="bg-zinc-950 border-b border-zinc-850 px-4 py-3 flex items-center justify-between text-[10px] text-zinc-550 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="h-2 w-2 rounded-full bg-green-500" />
              </div>
              <span className="bg-zinc-900 border border-zinc-850 px-3 py-0.5 rounded text-[9px] truncate max-w-[150px]">
                localhost:3000/p/preview
              </span>
              <span className="text-emerald-500 uppercase tracking-widest text-[8px] font-bold">● Active View</span>
            </div>

            {/* Content Preview Box */}
            <div 
              className={`p-6 space-y-6 min-h-[380px] transition-all duration-300 relative ${
                selectedTheme === 'executive' ? 'bg-slate-50 text-slate-700' : 'bg-zinc-950 text-zinc-200'
              } ${tokens.fontFamilyClass}`}
            >
              {/* Decorative gradients for preview */}
              {selectedTheme === 'creative' && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-transparent to-pink-950/20 pointer-events-none" />
              )}
              {selectedTheme === 'terminal' && (
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
              )}

              {/* Simulated navigation */}
              <div className={`flex items-center justify-between pb-3 border-b ${
                selectedTheme === 'executive' ? 'border-slate-200' : 'border-zinc-900'
              } text-[9px] font-mono`}>
                <span className="font-bold uppercase" style={{ color: accentColor }}>
                  {selectedTheme === 'terminal' ? 'PORTFOLIO.OS' : 'PORTFOLIO OS'}
                </span>
                <div className="flex gap-2">
                  <span>Home</span>
                  <span>Projects</span>
                  <span>Skills</span>
                </div>
              </div>

              {/* Simulated Hero */}
              <div className="space-y-2">
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                  selectedTheme === 'executive' ? 'bg-blue-100 text-blue-800' : 'bg-teal-950/40 text-teal-400 border border-teal-500/10'
                }`} style={{ color: selectedTheme === 'executive' ? undefined : accentColor }}>
                  {selectedTheme === 'terminal' ? 'guest@kernel:~$' : 'Verified Developer'}
                </span>
                
                <h3 className={`text-sm font-extrabold leading-tight ${
                  selectedTheme === 'executive' ? 'text-slate-900' : 'text-white'
                }`}>
                  {selectedTheme === 'terminal' && '> '}
                  {portfolioSettings?.headline || 'Lead Full Stack Software Architect'}
                </h3>
                
                <p className="text-[10px] opacity-60 leading-relaxed max-w-md">
                  Building highly available, multi-tenant scalable software web platforms. Specialized in TypeScript, Next.js, and cloud orchestration.
                </p>
              </div>

              {/* Grid Cards Showcase */}
              <div className="space-y-2">
                <h4 className={`text-[9px] uppercase tracking-wider font-mono font-bold ${
                  selectedTheme === 'executive' ? 'text-slate-900' : 'text-zinc-300'
                }`}>
                  // Projects Grid
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg border ${tokens.cardClass}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-mono opacity-50">TypeScript</span>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    </div>
                    <h5 className="text-[10px] font-bold mt-1.5">Portfolio OS Platform</h5>
                    <p className="text-[9px] opacity-50 mt-1 line-clamp-1">Multi-tenant theme engine</p>
                  </div>

                  <div className={`p-3 rounded-lg border ${tokens.cardClass}`}>
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-mono opacity-50">Next.js</span>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    </div>
                    <h5 className="text-[10px] font-bold mt-1.5">Analytics Engine API</h5>
                    <p className="text-[9px] opacity-50 mt-1 line-clamp-1">Cloud analytics visualizer</p>
                  </div>
                </div>
              </div>

              {/* Buttons and interaction presets */}
              <div className="flex gap-2">
                <button 
                  type="button" 
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase transition-all shadow-sm ${tokens.buttonAccentClass}`}
                  style={{ 
                    backgroundColor: selectedTheme === 'creative' ? undefined : accentColor,
                    color: selectedTheme === 'executive' ? '#ffffff' : undefined
                  }}
                >
                  Download CV
                </button>
                
                <button 
                  type="button" 
                  className={`px-3 py-1.5 text-[9px] font-semibold transition-all border ${tokens.buttonSecondaryClass}`}
                >
                  Contact
                </button>
              </div>

            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
