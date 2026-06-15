'use client';

import React, { useState } from 'react';
import { Mail, Lock, Check, Loader2, AtSign } from 'lucide-react';

/**
 * Account settings — change email and password.
 *
 * NOTE: This is a FRONTEND-ONLY surface for now. It validates input and shows
 * a success state locally; no request is sent to the backend yet. Wire it to
 * real endpoints (e.g. PUT /profile/account) when account mutation is enabled.
 */
export default function SettingsPanel({ profile }) {
  const [email, setEmail] = useState(profile?.email || '');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const handleEmailSave = async (e) => {
    e.preventDefault();
    setEmailError('');
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setEmailError('Enter a valid email address.');
      return;
    }
    setEmailSaving(true);
    // Frontend-only: simulate a save.
    await new Promise((r) => setTimeout(r, 500));
    setEmailSaving(false);
    setEmailSaved(true);
    setTimeout(() => setEmailSaved(false), 2000);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwdError('');
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New password and confirmation do not match.');
      return;
    }
    setPwdSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setPwdSaving(false);
    setPwdSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdSaved(false), 2000);
  };

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';

  return (
    <div className="space-y-8">
      <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
        Manage your account credentials. These changes are local for now and don&apos;t affect your saved login.
      </p>

      {/* Identity (read-only) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            <AtSign className="h-3.5 w-3.5" /> Username
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {profile?.username ? `@${profile.username}` : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Full name</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{profile?.name || '—'}</p>
        </div>
      </div>

      {/* Change email */}
      <form onSubmit={handleEmailSave} className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Mail className="h-4 w-4 text-indigo-600" /> Change email
        </h3>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          placeholder="you@campusflow.in"
          className={inputClass}
        />
        {emailError && <p className="text-xs font-medium text-rose-600">{emailError}</p>}
        <button
          type="submit"
          disabled={emailSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {emailSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : emailSaved ? <Check className="h-4 w-4" /> : null}
          {emailSaved ? 'Email updated' : 'Update email'}
        </button>
      </form>

      <div className="border-t border-gray-100" />

      {/* Change password */}
      <form onSubmit={handlePasswordSave} className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Lock className="h-4 w-4 text-indigo-600" /> Change password
        </h3>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          autoComplete="current-password"
          className={inputClass}
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setPwdError('');
          }}
          placeholder="New password (min 6 characters)"
          autoComplete="new-password"
          className={inputClass}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPwdError('');
          }}
          placeholder="Confirm new password"
          autoComplete="new-password"
          className={inputClass}
        />
        {pwdError && <p className="text-xs font-medium text-rose-600">{pwdError}</p>}
        <button
          type="submit"
          disabled={pwdSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {pwdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : pwdSaved ? <Check className="h-4 w-4" /> : null}
          {pwdSaved ? 'Password updated' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
