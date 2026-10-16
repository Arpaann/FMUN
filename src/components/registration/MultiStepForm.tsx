'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Users,
  Globe,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Shuffle,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Building,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Committee, Country, ConferenceSettings } from '@/types/database';
import { formatNPR } from '@/lib/utils';

interface MultiStepFormProps {
  settings: ConferenceSettings;
  committees: Committee[];
}

export function MultiStepForm({ settings, committees }: MultiStepFormProps) {
  const router = useRouter();

  // 3-step flow:
  // Step 1: Delegate Information (+2 Science & Management)
  // Step 2: Committee & Typed Country with duplicate rejection
  // Step 3: Payment & Pass
  const [currentStep, setCurrentStep] = useState(1);

  // Delegate details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('Fluorescent Secondary School');
  const [faculty, setFaculty] = useState('+2 Science');

  // Committee & Typed Country
  const [selectedCommitteeId, setSelectedCommitteeId] = useState(committees[0]?.id || '');
  const [typedCountryInput, setTypedCountryInput] = useState('');
  const [isCheckingCountry, setIsCheckingCountry] = useState(false);
  const [countryCheckResult, setCountryCheckResult] = useState<{
    status: 'idle' | 'success' | 'taken' | 'invalid';
    message?: string;
  }>({ status: 'idle' });

  // Reserved country allocation
  const [reservedCountry, setReservedCountry] = useState<Country | null>(null);
  const [allocationId, setAllocationId] = useState<string | null>(null);
  const [reservationToken, setReservationToken] = useState<string | null>(null);
  const [reservationExpiry, setReservationExpiry] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [randomizing, setRandomizing] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'physical' | 'esewa' | 'khalti'>('physical');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedReference, setConfirmedReference] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Hold Timer countdown
  useEffect(() => {
    if (!reservationExpiry) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(reservationExpiry).getTime() - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) {
        setReservedCountry(null);
        setAllocationId(null);
        setReservationToken(null);
        setReservationExpiry(null);
        setCountryCheckResult({
          status: 'invalid',
          message: 'Your 15-minute country hold has expired. Please type and reserve your country again.',
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservationExpiry]);

  // When committee changes, reset reserved country
  const handleCommitteeChange = (newCommId: string) => {
    setSelectedCommitteeId(newCommId);
    setReservedCountry(null);
    setAllocationId(null);
    setReservationToken(null);
    setReservationExpiry(null);
    setCountryCheckResult({ status: 'idle' });
  };

  // Typed Country Check & Reserve
  const handleCheckAndReserveTypedCountry = async () => {
    if (!typedCountryInput.trim()) {
      setCountryCheckResult({
        status: 'invalid',
        message: 'Please type the name of the country you want to represent.',
      });
      return;
    }

    setIsCheckingCountry(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/allocations/reserve-typed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          committeeId: selectedCommitteeId,
          countryInput: typedCountryInput.trim(),
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Taken or duplicate!
        setReservedCountry(null);
        setAllocationId(null);
        setReservationToken(null);
        setReservationExpiry(null);
        setCountryCheckResult({
          status: 'taken',
          message: data.message || `That country is already taken in this committee! Please type another country.`,
        });
        return;
      }

      if (!res.ok || !data.success) {
        setReservedCountry(null);
        setAllocationId(null);
        setReservationToken(null);
        setReservationExpiry(null);
        setCountryCheckResult({
          status: 'invalid',
          message: data.message || 'Country not recognized. Please check your spelling.',
        });
        return;
      }

      // Successfully reserved
      setReservedCountry(data.country);
      setAllocationId(data.allocationId);
      setReservationToken(data.token);
      setReservationExpiry(data.expiry);
      setCountryCheckResult({
        status: 'success',
        message: `${data.country.display_name} is available and successfully reserved!`,
      });
    } catch {
      setCountryCheckResult({
        status: 'invalid',
        message: 'Unable to check country availability. Please check your connection.',
      });
    } finally {
      setIsCheckingCountry(false);
    }
  };

  // Random country generator
  const handleGenerateRandom = async () => {
    setRandomizing(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/allocations/random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ committeeId: selectedCommitteeId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCountryCheckResult({
          status: 'invalid',
          message: data.message || 'No countries currently available in this committee.',
        });
        return;
      }

      setReservedCountry(data.country);
      setAllocationId(data.allocationId);
      setReservationToken(data.token);
      setReservationExpiry(data.expiry);
      setTypedCountryInput(data.country.name);
      setCountryCheckResult({
        status: 'success',
        message: `Randomly assigned: ${data.country.display_name}!`,
      });
    } catch {
      setCountryCheckResult({
        status: 'invalid',
        message: 'Error generating random country. Please try again.',
      });
    } finally {
      setRandomizing(false);
    }
  };

  // Final Registration Submission
  const handleSubmit = async () => {
    if (!termsAccepted) {
      setSubmitError('Please accept the delegate terms & code of conduct.');
      return;
    }

    if (!reservedCountry || !allocationId || !reservationToken) {
      setSubmitError('Please type and confirm your country reservation before proceeding.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/registration/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          institution,
          academicLevel: faculty,
          committeeId: selectedCommitteeId,
          countryId: reservedCountry.id,
          allocationId,
          reservationToken,
          paymentMethod,
          dietaryRequirements: null,
          consentGiven: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.message || 'Registration submission failed. Please try again.');
        return;
      }

      setConfirmedReference(data.referenceCode);
      setCurrentStep(4);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

      if (data.gatewayPayload?.type === 'khalti' && data.gatewayPayload.paymentUrl) {
        window.location.href = data.gatewayPayload.paymentUrl;
      }
    } catch {
      setSubmitError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCommittee = committees.find((c) => c.id === selectedCommitteeId);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 text-white">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        {[
          { step: 1, label: '1. You' },
          { step: 2, label: '2. Committee & Country' },
          { step: 3, label: '3. Payment' },
        ].map((item) => {
          const isDone = currentStep > item.step;
          const isCurrent = currentStep === item.step;

          return (
            <div key={item.step} className="flex items-center space-x-2 text-xs">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : isCurrent
                    ? 'bg-[#0F172A] border-2 border-[#38BDF8] text-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'bg-[#0A0D14] text-[#64748B] border border-[#1C2331]'
                }`}
              >
                {item.step}
              </span>
              <span
                className={`font-semibold tracking-wide ${
                  isCurrent ? 'text-[#38BDF8]' : isDone ? 'text-white' : 'text-[#64748B]'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {submitError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* STEP 1: Personal Details */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0A0D14] border border-[#1C2331] shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-5">
          <div className="border-b border-[#1C2331] pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Delegate Registration
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Fluorescent Secondary School • Strictly capped at 30 delegates
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#CBD5E1] block mb-1.5">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#CBD5E1] block mb-1.5">Faculty / Stream *</label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                >
                  <option value="+2 Science">+2 Science</option>
                  <option value="+2 Management">+2 Management</option>
                  <option value="Grade 10 (SEE)">Grade 10 (SEE)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#CBD5E1] block mb-1.5">Institution / Campus *</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#CBD5E1] block mb-1.5">Phone (+977) *</label>
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#CBD5E1] block mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!fullName || !email || !phone) {
                  setSubmitError('Please fill in your name, email, and phone number.');
                  return;
                }
                setSubmitError(null);
                setCurrentStep(2);
              }}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-[#F1F5F9] text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <span>Next: Committee & Country</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Committee & Typed Country with Anti-Duplicate Validation */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0A0D14] border border-[#1C2331] shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-6">
          <div className="border-b border-[#1C2331] pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Committee & Country Preference
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Select your committee directly below, then type in your country.
            </p>
          </div>

          {/* 1. Committee Choice in the Form */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider block">
              1. Choose Committee
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {committees.map((comm) => {
                const isSelected = selectedCommitteeId === comm.id;
                return (
                  <div
                    key={comm.id}
                    onClick={() => handleCommitteeChange(comm.id)}
                    className={`p-4 rounded-2xl cursor-pointer border text-xs transition-all ${
                      isSelected
                        ? 'bg-[#0F172A] border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                        : 'bg-[#03060B] border-[#1C2331] hover:border-[#272E3B]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base text-[#38BDF8]">{comm.acronym}</span>
                      <span className="text-[10px] text-[#64748B]">{comm.capacity} delegates max</span>
                    </div>
                    <div className="font-semibold text-white mt-1">{comm.name}</div>
                    <p className="text-[11px] text-[#94A3B8] mt-1 line-clamp-1">{comm.agenda || comm.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Typed Country Input with Anti-Duplicate Validation */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
                2. Type in Your Country Name
              </label>

              {/* Random country generator button */}
              <button
                type="button"
                disabled={randomizing}
                onClick={handleGenerateRandom}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#111622] hover:bg-[#1A2234] text-[#38BDF8] border border-[#38BDF8]/40 text-[11px] font-semibold transition-all"
              >
                <Shuffle className={`w-3 h-3 ${randomizing ? 'animate-spin' : ''}`} />
                <span>{randomizing ? 'Assigning...' : 'Random Country'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g., Japan, Nepal, France, Brazil, Germany..."
                  value={typedCountryInput}
                  onChange={(e) => {
                    setTypedCountryInput(e.target.value);
                    if (countryCheckResult.status !== 'idle') {
                      setCountryCheckResult({ status: 'idle' });
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCheckAndReserveTypedCountry();
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#03060B] border border-[#1C2331] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <button
                type="button"
                disabled={isCheckingCountry || !typedCountryInput.trim()}
                onClick={handleCheckAndReserveTypedCountry}
                className="px-5 py-2.5 rounded-xl bg-[#161B26] hover:bg-[#202736] text-white font-semibold text-xs border border-[#272E3B] transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isCheckingCountry ? 'Checking...' : 'Check & Reserve'}</span>
              </button>
            </div>

            {/* Validation Feedback Banner */}
            {countryCheckResult.status === 'taken' && (
              <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-xs text-rose-200 space-y-1">
                <div className="flex items-center space-x-2 font-bold text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Country Already Taken</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-200/90">
                  {countryCheckResult.message}
                </p>
              </div>
            )}

            {countryCheckResult.status === 'invalid' && (
              <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-xs text-amber-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{countryCheckResult.message}</span>
              </div>
            )}

            {reservedCountry && countryCheckResult.status === 'success' && (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/60 flex items-center justify-between text-xs shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{reservedCountry.flag_emoji || '🌐'}</span>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Reserved For You
                    </span>
                    <p className="font-extrabold text-white text-sm">{reservedCountry.display_name}</p>
                  </div>
                </div>
                {secondsRemaining > 0 && (
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400/80 block uppercase">Hold Timer</span>
                    <span className="font-mono text-xs font-bold text-amber-300">
                      {Math.floor(secondsRemaining / 60)}:
                      {(secondsRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-[#94A3B8] hover:text-white flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!reservedCountry || !allocationId) {
                  setSubmitError('Please type and successfully reserve a country first.');
                  return;
                }
                setSubmitError(null);
                setCurrentStep(3);
              }}
              disabled={!reservedCountry}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-[#F1F5F9] text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-40"
            >
              <span>Next: Payment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Payment & Final Submit */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0A0D14] border border-[#1C2331] shadow-[0_0_30px_rgba(0,0,0,0.8)] space-y-5">
          <div className="border-b border-[#1C2331] pb-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Payment & Confirmation
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Delegate Fee: <strong className="text-white">{formatNPR(settings.registration_fee)}</strong> (Includes kit, lunches, stationery & DJ night)
            </p>
          </div>

          {/* Quick Summary Card */}
          <div className="p-4 rounded-2xl bg-[#03060B] border border-[#1C2331] text-xs grid grid-cols-2 gap-3">
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase">Delegate</span>
              <p className="font-semibold text-white">{fullName}</p>
              <p className="text-[#94A3B8] text-[11px]">{faculty}</p>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase">Council & Country</span>
              <p className="font-semibold text-[#38BDF8]">
                {selectedCommittee?.acronym} — {reservedCountry?.display_name}
              </p>
              <p className="text-[#94A3B8] text-[11px]">{reservedCountry?.code || 'UN Member'}</p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider block">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('physical')}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'physical'
                    ? 'bg-[#0F172A] border-[#38BDF8] font-bold text-white shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                    : 'bg-[#03060B] border-[#1C2331] text-[#94A3B8] hover:border-[#272E3B]'
                }`}
              >
                <div className="font-bold">Cash at Desk</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Administration</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('esewa')}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'esewa'
                    ? 'bg-[#0F172A] border-emerald-400 font-bold text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                    : 'bg-[#03060B] border-[#1C2331] text-[#94A3B8] hover:border-[#272E3B]'
                }`}
              >
                <div className="font-bold">eSewa</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Instant Digital</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('khalti')}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'khalti'
                    ? 'bg-[#0F172A] border-purple-400 font-bold text-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.2)]'
                    : 'bg-[#03060B] border-[#1C2331] text-[#94A3B8] hover:border-[#272E3B]'
                }`}
              >
                <div className="font-bold">Khalti</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Instant Digital</div>
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs text-[#94A3B8] hover:text-white flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-[#F1F5F9] text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Registering...' : 'Confirm Registration'}</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Pass */}
      {currentStep === 4 && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0A0D14] border border-[#1C2331] text-center space-y-6 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
          <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/60 mx-auto flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Registration Confirmed!
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1.5 max-w-sm mx-auto">
              You are officially registered for Fluorescent MUN 2026. Keep your reference code safe.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#03060B] border border-[#272E3B] max-w-sm mx-auto space-y-2">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider block">
              Official Reference Code
            </span>
            <div className="font-mono text-2xl font-extrabold text-[#38BDF8]">
              {confirmedReference}
            </div>
            <button
              onClick={() => {
                if (confirmedReference) {
                  navigator.clipboard.writeText(confirmedReference);
                  setCopiedRef(true);
                  setTimeout(() => setCopiedRef(false), 2000);
                }
              }}
              className="text-xs text-[#94A3B8] hover:text-white inline-flex items-center space-x-1.5 transition-colors"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRef ? 'Copied to Clipboard' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
            <button
              onClick={() => router.push(`/#after-party`)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-[#F1F5F9] transition-all"
            >
              Request Party Songs
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#111622] text-[#E2E8F0] border border-[#272E3B] hover:text-white transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
