'use client';

import * as React from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Trash2, Sparkles, BookOpen, Briefcase } from 'lucide-react';
import { ParsedResume } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

interface ResumeUploaderProps {
  onResumeParsed: (resume: ParsedResume | null) => void;
  currentResume?: ParsedResume | null;
}

export function ResumeUploader({ onResumeParsed, currentResume }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [resumeData, setResumeData] = React.useState<ParsedResume | null>(currentResume || null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      toast({
        type: 'error',
        title: 'Unsupported file type',
        description: 'Please upload a PDF or DOCX resume document.',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        type: 'error',
        title: 'File too large',
        description: 'Maximum file size allowed is 5 MB.',
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.resume) {
        setResumeData(data.resume);
        onResumeParsed(data.resume);
        toast({
          type: 'success',
          title: 'Resume parsed successfully! 🎉',
          description: `Extracted ${data.resume.skills.length} skills and project details.`,
        });
      } else {
        throw new Error(data.error || 'Failed to parse resume');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      toast({
        type: 'error',
        title: 'Resume processing error',
        description: message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setResumeData(null);
    onResumeParsed(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast({
      type: 'info',
      title: 'Resume removed',
      description: 'You can practice general role questions or upload a new resume.',
    });
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />

      {!resumeData ? (
        /* Drag and Drop Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-primary bg-primary/10 scale-[1.01]'
              : 'border-white/15 bg-surface-card hover:border-primary/50 hover:bg-white/[0.02]'
          }`}
        >
          <div className="h-14 w-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            {isUploading ? (
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <UploadCloud className="h-7 w-7" />
            )}
          </div>

          <div>
            <h4 className="text-base font-bold text-white">
              {isUploading ? 'Analyzing Resume with AI...' : 'Upload your Resume'}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Drag & drop your PDF or DOCX file here, or click to browse (Max 5MB)
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">PDF</Badge>
            <Badge variant="outline">DOCX</Badge>
            <span className="text-[11px] text-muted-foreground">Zero permanent storage</span>
          </div>
        </div>
      ) : (
        /* Extracted Information Preview Card */
        <div className="rounded-2xl bg-surface border border-emerald-500/30 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {resumeData.fileName}
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </h4>
                <p className="text-xs text-muted-foreground">
                  Resume processed • {(resumeData.fileSize / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={handleRemove}
              className="text-xs"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Remove Resume
            </Button>
          </div>

          {/* Extracted Skills */}
          {resumeData.skills.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Extracted Technologies & Skills ({resumeData.skills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.skills.map((skill) => (
                  <Badge key={skill} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Projects */}
          {resumeData.projects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Briefcase className="h-3.5 w-3.5 text-secondary" />
                Identified Projects
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {resumeData.projects.map((p, idx) => (
                  <div key={idx} className="rounded-xl bg-black/30 border border-white/5 p-3 text-xs space-y-1">
                    <p className="font-bold text-white">{p.title}</p>
                    <p className="text-muted-foreground text-[11px] line-clamp-2">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
