import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';
import { Resume, CloudinaryAsset } from '@/types';
import { FileText, Plus, Brain, Sparkles, Loader2, Save, ExternalLink, Trash2 } from 'lucide-react';
import CloudinaryUploadZone from '@/components/features/CloudinaryUploadZone';

interface ResumeSectionProps {
  resumes: Resume[];
  refetchResumes: () => void;
}

export default function ResumeSection({ resumes, refetchResumes }: ResumeSectionProps) {
  const queryClient = useQueryClient();
  
  // Resumes states
  const [isAddingResume, setIsAddingResume] = useState(false);
  const [resumeLabel, setResumeLabel] = useState('');
  const [resumeFileAsset, setResumeFileAsset] = useState<CloudinaryAsset | null>(null);
  const [resumeIsActive, setResumeIsActive] = useState(false);

  // AI Resume Parser state
  const [resumeRawText, setResumeRawText] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parsedResumeResult, setParsedResumeResult] = useState<any>(null);
  const [resumeParseError, setResumeParseError] = useState('');

  // Mutations
  const createResumeMutation = useMutation({
    mutationFn: async (resData: { label: string; resumeFile: CloudinaryAsset; isActive: boolean }) => {
      const res = await apiFetch('/resume', { method: 'POST', body: JSON.stringify(resData) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => {
      refetchResumes();
      setIsAddingResume(false);
      setResumeLabel('');
      setResumeFileAsset(null);
      setResumeIsActive(false);
    }
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiFetch(`/resume/${id}`, { method: 'DELETE' });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => refetchResumes()
  });

  const toggleResumeActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiFetch(`/resume/${id}`, { method: 'PATCH', body: JSON.stringify({ isActive }) });
      if (res.error) throw new Error(res.error);
      return res.data;
    },
    onSuccess: () => refetchResumes()
  });

  // AI Resume Parsing handler
  const handleAIResumeParse = async () => {
    const text = resumeRawText.trim();
    if (!text) return;
    setIsParsingResume(true);
    setResumeParseError('');
    setParsedResumeResult(null);

    try {
      const res = await apiFetch<any>('/ai/resume/parse', {
        method: 'POST',
        body: JSON.stringify({ resumeText: text })
      });
      
      if (res.error) {
        setResumeParseError(res.error);
      } else if (res.data) {
        setParsedResumeResult(res.data);
      }
    } catch {
      setResumeParseError('Network error parsing resume. Please configure GEMINI_API_KEY.');
    } finally {
      setIsParsingResume(false);
    }
  };

  // Import parsed AI elements
  const handleImportParsedData = async () => {
    if (!parsedResumeResult) return;

    // 1. Import skills
    if (parsedResumeResult.skills && Array.isArray(parsedResumeResult.skills)) {
      for (const skillName of parsedResumeResult.skills) {
        try {
          await apiFetch('/skills', {
            method: 'POST',
            body: JSON.stringify({
              name: skillName,
              proficiency: 80,
              category: 'other'
            })
          });
        } catch (e) {
          console.error('Failed to import skill:', skillName);
        }
      }
    }

    // 2. Import experiences
    if (parsedResumeResult.experience && Array.isArray(parsedResumeResult.experience)) {
      for (const exp of parsedResumeResult.experience) {
        try {
          await apiFetch('/experience', {
            method: 'POST',
            body: JSON.stringify({
              organization: exp.organization || 'Org Name',
              role: exp.role || 'Role',
              type: 'job',
              startDate: exp.startDate || new Date().toISOString().split('T')[0],
              endDate: exp.endDate || '',
              description: exp.description || ''
            })
          });
        } catch (e) {
          console.error('Failed to import experience:', exp);
        }
      }
    }

    // Reset AI state
    setParsedResumeResult(null);
    setResumeRawText('');
    
    // Invalidate queries so parent dashboard reloads updated skills and experiences!
    queryClient.invalidateQueries({ queryKey: ['my-skills'] });
    queryClient.invalidateQueries({ queryKey: ['my-experiences'] });
    queryClient.invalidateQueries({ queryKey: ['progress'] });

    alert('Resume data successfully parsed and imported into your profile!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI Resume Parser Section */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md space-y-4">
        <div className="border-b border-zinc-900 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-teal-400" />
            <span>AI Automated Resume Import</span>
          </h2>
          <p className="text-xs text-zinc-500">Paste your raw text resume below. Portfolio OS AI will parse it to auto-populate your skills and work experiences.</p>
        </div>

        <div className="space-y-3">
          <textarea
            rows={5}
            value={resumeRawText}
            onChange={e => setResumeRawText(e.target.value)}
            placeholder="Paste text resume content here..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-teal-500 resize-none font-sans"
          />
          
          <button
            onClick={handleAIResumeParse}
            disabled={isParsingResume || !resumeRawText.trim()}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-400 hover:to-indigo-400 text-zinc-950 px-5 py-2 text-xs font-mono font-bold transition-all disabled:opacity-50"
          >
            {isParsingResume ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span>{isParsingResume ? 'AI Processing...' : 'Compile with AI'}</span>
          </button>
        </div>

        {resumeParseError && (
          <p className="text-xs text-red-500 font-mono">{resumeParseError}</p>
        )}

        {parsedResumeResult && (
          <div className="rounded-lg border border-teal-500/25 bg-teal-950/5 p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className="text-xs font-mono font-bold text-teal-400">AI Parsing Results: READY</span>
              <button onClick={handleImportParsedData} className="text-xs bg-teal-500 text-zinc-950 font-bold px-3 py-1 rounded-lg">Import to Profile</button>
            </div>
            <div className="text-xs text-zinc-400 font-mono space-y-2 max-h-60 overflow-y-auto">
              <p><span className="text-[#ce9178] font-bold">Skills detected:</span> {parsedResumeResult.skills?.join(', ')}</p>
              <div className="space-y-2">
                <p className="text-[#ce9178] font-bold">Experience timelines:</p>
                {parsedResumeResult.experience?.map((e: any, idx: number) => (
                  <div key={idx} className="pl-4 border-l border-zinc-800 py-1">
                    <p className="text-white font-bold">{e.role} @ {e.organization}</p>
                    <p className="text-zinc-500 text-[10px]">{e.startDate} - {e.endDate || 'Present'}</p>
                    <p className="text-zinc-400 text-[11px] font-sans leading-relaxed mt-1">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Core PDF Upload Center */}
      <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 backdrop-blur-md space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-teal-400" />
            <span>Manage Resume Attachments</span>
          </h3>
          {!isAddingResume && (
            <button onClick={() => { setIsAddingResume(true); setResumeLabel(''); setResumeFileAsset(null); }} className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300">
              <Plus className="h-3.5 w-3.5" />
              <span>Upload PDF</span>
            </button>
          )}
        </div>

        {isAddingResume && (
          <div className="border border-zinc-850 bg-zinc-950/40 p-4 rounded-xl space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Resume Name label *</label>
                <input type="text" required value={resumeLabel} onChange={e => setResumeLabel(e.target.value)} placeholder="e.g. Lead Software Engineer Resume" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-xs outline-none focus:border-teal-500" />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 mt-4">
                  <input type="checkbox" checked={resumeIsActive} onChange={e => setResumeIsActive(e.target.checked)} className="rounded border-zinc-805 bg-zinc-950 text-teal-500" />
                  <span>Set as Active public resume</span>
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-zinc-400 mb-2">Upload PDF Document *</label>
                <CloudinaryUploadZone
                  endpoint="resume"
                  acceptType="pdf"
                  label="Drop PDF Resume here"
                  value={resumeFileAsset}
                  onUploadSuccess={asset => setResumeFileAsset(asset)}
                  onRemove={() => setResumeFileAsset(null)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAddingResume(false)} className="text-xs text-zinc-400 hover:text-zinc-200 font-mono">Cancel</button>
              <button
                type="button"
                disabled={!resumeLabel.trim() || !resumeFileAsset}
                onClick={() => createResumeMutation.mutate({ label: resumeLabel, resumeFile: resumeFileAsset!, isActive: resumeIsActive })}
                className="bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold px-4 py-1.5 rounded text-xs font-mono disabled:opacity-50"
              >
                Save Resume Link
              </button>
            </div>
          </div>
        )}

        <div className="divide-y divide-zinc-900/60">
          {resumes.map(res => (
            <div key={res._id} className="flex items-center justify-between py-3">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-bold text-xs truncate">{res.label}</h4>
                  {res.isActive && (
                    <span className="rounded bg-teal-950 border border-teal-500/20 px-2 py-0.5 text-[9px] font-mono font-bold text-teal-400 uppercase">Active</span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">Uploaded {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                {!res.isActive && (
                  <button onClick={() => toggleResumeActiveMutation.mutate({ id: res._id!, isActive: true })} className="text-[10px] text-teal-400 font-mono border border-teal-500/20 px-2 py-1 rounded hover:bg-teal-950/20">Set Active</button>
                )}
                <a href={res.resumeFile.secureUrl} target="_blank" rel="noreferrer" className="p-2 border border-zinc-850 hover:bg-zinc-900 rounded text-zinc-400">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button onClick={() => { if(confirm('Delete resume?')) deleteResumeMutation.mutate(res._id!); }} className="p-2 border border-zinc-850 hover:bg-red-950/10 rounded text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
