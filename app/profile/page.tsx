'use client';

import * as React from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Layers,
  Sparkles,
  Plus,
  X,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { getStoredUser, saveStoredUser } from '@/lib/store/user-store';
import { UserProfile } from '@/types/user';

export default function ProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [newSkill, setNewSkill] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setProfile(getStoredUser());
  }, []);

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (profile.skills.includes(newSkill.trim())) {
      toast({ type: 'warning', title: 'Skill already added' });
      return;
    }
    const updated = {
      ...profile,
      skills: [...profile.skills, newSkill.trim()],
    };
    setProfile(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = {
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    };
    setProfile(updated);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      saveStoredUser(profile);
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      toast({
        type: 'success',
        title: 'Profile Updated! 🎉',
        description: 'Your target role, education, and skill preferences have been saved.',
      });
    } catch {
      toast({ type: 'info', title: 'Saved locally' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-[#070711]">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <User className="h-7 w-7 text-primary" />
              Candidate Profile
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your personal details, target roles, and core competency skills.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Banner Card */}
          <div className="rounded-3xl bg-surface border border-white/10 p-6 shadow-xl flex flex-col sm:flex-row items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/30 shrink-0">
              {profile.name.charAt(0)}
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h3 className="text-xl font-bold text-white">{profile.name}</h3>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <Badge variant="primary">{profile.targetRole}</Badge>
                <Badge variant="outline">{profile.experienceLevel} Level</Badge>
              </div>
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Personal & Contact Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Short Bio</label>
                <input
                  type="text"
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Academic Background
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground">College / University</label>
                <input
                  type="text"
                  value={profile.college || ''}
                  onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Graduation Year</label>
                <input
                  type="text"
                  value={profile.graduationYear || ''}
                  onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-3">
                <label className="text-xs font-semibold text-muted-foreground">Degree & Branch</label>
                <input
                  type="text"
                  value={profile.degree || ''}
                  onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Career & Target Roles */}
          <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Interview & Career Goals
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Target Role</label>
                <select
                  value={profile.targetRole}
                  onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Experience Level</label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Internship">Internship</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Experienced">Experienced</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Preferred Interview Type</label>
                <select
                  value={profile.preferredInterviewType}
                  onChange={(e) => setProfile({ ...profile, preferredInterviewType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="Technical">Technical</option>
                  <option value="HR / Behavioral">HR / Behavioral</option>
                  <option value="Mixed">Mixed</option>
                  <option value="Resume Based">Resume Based</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Skills Section */}
          <div className="rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Skills & Tech Stack ({profile.skills.length})
            </h4>
            <p className="text-xs text-muted-foreground">
              Add technologies or skills you want the AI to formulate questions around.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {profile.skills.map((skill) => (
                <div
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs text-white"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-muted-foreground hover:text-rose-400 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add skill input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. Next.js, Redis, Docker, System Design)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="glow" size="lg" isLoading={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              <span>Save Profile Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
