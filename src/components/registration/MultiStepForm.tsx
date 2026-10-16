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

  // Streamlined 3-step flow:
  // Step 1: Your Details (+2 Faculty)
  // Step 2: Committee & Country (All inside the form!)
  // Step 3: Payment & Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Delegate info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('Fluorescent Secondary School');
  const [faculty, setFaculty] = useState('+2 Science');

  // Committee & Country
  const [selectedCommitteeId, setSelectedCommitteeId] = useState(committees[0]?.id || '');
  const [committeeCountries, setCommitteeCountries] = useState<
    { country: Country; status: 'available' | 'held' | 'assigned' }[]
  >([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
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

  // Load committee country availability whenever committee changes
  useEffect(() => {
    if (!selectedCommitteeId) return;

    let isMounted = true;
    setLoadingCountries(true);

    fetch(`/api/allocations/committee-countries?committeeId=${selectedCommitteeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.countries) {
          setCommitteeCountries(data.countries);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingCountries(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCommitteeId]);

  // Hold Timer countdown
  useEffect(() => {
    if (!reservationExpiry) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(reservationExpiry).getTime() - Date.now()) / 1000));
      setSecondsRemaining(remaining);
      if (remaining === 0) {
        setSelectedCountryId(null);
        setAllocationId(null);
        setReservationToken(null);
        setReservationExpiry(null);
        setSubmitError('Reservation hold expired. Please pick or randomize your country again.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservationExpiry]);

  // Reserve country
  const handleSelectCountry = async (countryId: string) => {
    setSubmitError(null);
    try {
      const res = await fetch('/api/allocations/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ committeeId: selectedCommitteeId, countryId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.message || 'Country is already taken');
        return;
      }

      setSelectedCountryId(countryId);
      setAllocationId(data.allocationId);
      setReservationToken(data.token);
      setReservationExpiry(data.expiry);
    } catch {
      setSubmitError('Failed to reserve country. Please try again.');
    }
  };

  // Random Country Generator
  const handleGenerateRandom = async () => {
    setSubmitError(null);
    setRandomizing(true);
    try {
      const res = await fetch('/api/allocations/random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ committeeId: selectedCommitteeId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.message || 'No country could be randomly generated.');
        return;
      }

      setSelectedCountryId(data.country.id);
      setAllocationId(data.allocationId);
      setReservationToken(data.token);
      setReservationExpiry(data.expiry);
    } catch {
      setSubmitError('Failed to pick random country.');
    } finally {
      setRandomizing(false);
    }
  };

  // Submit Registration
  const handleSubmit = async () => {
    setSubmitError(null);

    if (!selectedCountryId || !allocationId || !reservationToken) {
      setSubmitError('Please choose or generate your country in Step 2.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          institution,
          academicLevel: faculty,
          committeeId: selectedCommitteeId,
          countryId: selectedCountryId,
          allocationId,
          reservationToken,
          paymentMethod,
          termsAccepted: true,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.message || 'Registration failed.');
        setIsSubmitting(false);
        return;
      }

      setConfirmedReference(data.referenceCode);
      setCurrentStep(4); // Confirmed view
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

      if (data.gatewayPayload?.type === 'khalti' && data.gatewayPayload.paymentUrl) {
        window.location.href = data.gatewayPayload.paymentUrl;
      }
    } catch {
      setSubmitError('A connection error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCommittee = committees.find((c) => c.id === selectedCommitteeId);
  const selectedCountry = committeeCountries.find((c) => c.country.id === selectedCountryId)?.country;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
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
            <div key={item.step} className="flex items-center space-x-1.5 text-xs">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  isDone
                    ? 'bg-[#C9A96E] text-[#07111F]'
                    : isCurrent
                    ? 'bg-[#101E33] border border-[#C9A96E] text-[#C9A96E]'
                    : 'bg-[#0B1728] text-[#8B95A5] border border-[#1F304B]'
                }`}
              >
                {item.step}
              </span>
              <span
                className={`font-medium ${
                  isCurrent ? 'text-[#C9A96E]' : isDone ? 'text-[#F6F2E9]' : 'text-[#8B95A5]'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {submitError && (
        <div className="mb-6 p-3.5 rounded bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* STEP 1: Personal Details */}
      {currentStep === 1 && (
        <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-5">
          <div className="border-b border-[#1F304B] pb-3">
            <h2 className="font-serif text-xl font-bold text-[#F6F2E9]">
              Delegate Details
            </h2>
            <p className="text-xs text-[#8B95A5]">
              Fluorescent Secondary School • Limited to 30 delegates
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-[#F6F2E9] block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-[#F6F2E9] block mb-1">Faculty / Stream *</label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                >
                  <option value="+2 Science">+2 Science</option>
                  <option value="+2 Management">+2 Management</option>
                  <option value="Grade 10 (SEE)">Grade 10 (SEE)</option>
                  <option value="A-Levels / Other">A-Levels / Other</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-[#F6F2E9] block mb-1">Institution / School *</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-[#F6F2E9] block mb-1">Phone (+977) *</label>
                <input
                  type="tel"
                  required
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>

              <div>
                <label className="font-medium text-[#F6F2E9] block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded bg-[#101E33] border border-[#1F304B] text-xs text-[#F6F2E9] focus:outline-none focus:border-[#C9A96E]"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
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
              className="px-5 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-wider flex items-center space-x-2"
            >
              <span>Next: Committee & Country</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Committee & Country (Combined inside the form!) */}
      {currentStep === 2 && (
        <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-6">
          <div className="border-b border-[#1F304B] pb-3">
            <h2 className="font-serif text-xl font-bold text-[#F6F2E9]">
              Choose Committee & Country
            </h2>
            <p className="text-xs text-[#8B95A5]">
              Pick your council and select or randomly generate an available country.
            </p>
          </div>

          {/* Committee Choice Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#F6F2E9] uppercase tracking-wider">
              1. Select Your Committee
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {committees.map((comm) => {
                const isSelected = selectedCommitteeId === comm.id;
                return (
                  <div
                    key={comm.id}
                    onClick={() => {
                      setSelectedCommitteeId(comm.id);
                      setSelectedCountryId(null);
                      setAllocationId(null);
                      setReservationToken(null);
                      setReservationExpiry(null);
                    }}
                    className={`p-3.5 rounded-lg cursor-pointer border text-xs transition-all ${
                      isSelected
                        ? 'bg-[#101E33] border-[#C9A96E]'
                        : 'bg-[#07111F] border-[#1F304B] hover:border-[#1F304B]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#C9A96E]">{comm.acronym}</span>
                      <span className="text-[10px] text-[#8B95A5]">{comm.capacity} delegates max</span>
                    </div>
                    <div className="font-medium text-[#F6F2E9] mt-1">{comm.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Country Selection (Browse or Random Pick) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#F6F2E9] uppercase tracking-wider">
                2. Select Your Country
              </label>

              {/* Random button */}
              <button
                type="button"
                disabled={randomizing}
                onClick={handleGenerateRandom}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#101E33] hover:bg-[#15253F] text-[#C9A96E] border border-[#C9A96E]/40 text-xs font-semibold"
              >
                <Shuffle className={`w-3.5 h-3.5 ${randomizing ? 'animate-spin' : ''}`} />
                <span>{randomizing ? 'Picking...' : 'Random Country'}</span>
              </button>
            </div>

            {/* Currently selected country pill */}
            {selectedCountry && (
              <div className="p-3 rounded bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{selectedCountry.flag_emoji || '🌐'}</span>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">Selected</span>
                    <p className="font-bold text-[#F6F2E9]">{selectedCountry.display_name}</p>
                  </div>
                </div>
                {secondsRemaining > 0 && (
                  <span className="font-mono text-[11px] text-amber-300">
                    Held: {Math.floor(secondsRemaining / 60)}:
                    {(secondsRemaining % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            )}

            {/* Country list */}
            {loadingCountries ? (
              <p className="text-xs text-[#8B95A5]">Loading countries...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                {committeeCountries.map(({ country, status }) => {
                  const isAvailable = status === 'available';
                  const isSelected = selectedCountryId === country.id;

                  return (
                    <button
                      key={country.id}
                      type="button"
                      disabled={!isAvailable && !isSelected}
                      onClick={() => handleSelectCountry(country.id)}
                      className={`p-2 rounded text-left text-xs flex items-center space-x-2 border transition-colors ${
                        isSelected
                          ? 'bg-[#C9A96E] text-[#07111F] font-bold border-[#C9A96E]'
                          : isAvailable
                          ? 'bg-[#101E33] border-[#1F304B] text-[#F6F2E9] hover:border-[#C9A96E]/40'
                          : 'bg-[#07111F] border-[#1F304B]/30 text-[#8B95A5]/50 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span>{country.flag_emoji || '🌐'}</span>
                      <span className="truncate">{country.display_name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs text-[#8B95A5] hover:text-[#F6F2E9] flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!selectedCountryId || !allocationId) {
                  setSubmitError('Please choose or randomize a country.');
                  return;
                }
                setSubmitError(null);
                setCurrentStep(3);
              }}
              className="px-5 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-wider flex items-center space-x-2"
            >
              <span>Next: Payment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Payment & Final Submit */}
      {currentStep === 3 && (
        <div className="p-6 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-5">
          <div className="border-b border-[#1F304B] pb-3">
            <h2 className="font-serif text-xl font-bold text-[#F6F2E9]">
              Payment & Confirmation
            </h2>
            <p className="text-xs text-[#8B95A5]">
              Fee: <strong className="text-[#C9A96E]">{formatNPR(settings.registration_fee)}</strong> (Includes kit, meals & after-party)
            </p>
          </div>

          {/* Quick Summary */}
          <div className="p-3.5 rounded bg-[#101E33] border border-[#1F304B] text-xs grid grid-cols-2 gap-2">
            <div>
              <span className="text-[#8B95A5]">Delegate:</span>
              <p className="font-medium text-[#F6F2E9]">{fullName} ({faculty})</p>
            </div>
            <div>
              <span className="text-[#8B95A5]">Council & Country:</span>
              <p className="font-medium text-[#F6F2E9]">
                {selectedCommittee?.acronym} — {selectedCountry?.display_name}
              </p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#F6F2E9] uppercase tracking-wider block">
              How will you pay?
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('physical')}
                className={`p-3 rounded border text-center transition-all ${
                  paymentMethod === 'physical'
                    ? 'bg-[#101E33] border-[#C9A96E] font-bold text-[#F6F2E9]'
                    : 'bg-[#07111F] border-[#1F304B] text-[#8B95A5]'
                }`}
              >
                Cash at School
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('esewa')}
                className={`p-3 rounded border text-center transition-all ${
                  paymentMethod === 'esewa'
                    ? 'bg-[#101E33] border-emerald-400 font-bold text-emerald-400'
                    : 'bg-[#07111F] border-[#1F304B] text-[#8B95A5]'
                }`}
              >
                eSewa
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('khalti')}
                className={`p-3 rounded border text-center transition-all ${
                  paymentMethod === 'khalti'
                    ? 'bg-[#101E33] border-purple-400 font-bold text-purple-400'
                    : 'bg-[#07111F] border-[#1F304B] text-[#8B95A5]'
                }`}
              >
                Khalti
              </button>
            </div>
          </div>

          <div className="pt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs text-[#8B95A5] hover:text-[#F6F2E9] flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-wider flex items-center space-x-2"
            >
              <span>{isSubmitting ? 'Registering...' : 'Confirm Registration'}</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success Pass */}
      {currentStep === 4 && (
        <div className="p-8 rounded-xl bg-[#0B1728] border border-[#C9A96E]/50 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 mx-auto flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-[#F6F2E9]">
              Registration Confirmed!
            </h2>
            <p className="text-xs text-[#8B95A5] mt-1">
              You are officially registered for Fluorescent MUN 2026.
            </p>
          </div>

          <div className="p-4 rounded bg-[#101E33] border border-[#C9A96E]/30 max-w-sm mx-auto space-y-2">
            <span className="text-[10px] text-[#8B95A5] uppercase tracking-wider">Reference Code</span>
            <div className="font-mono text-xl font-bold text-[#C9A96E]">{confirmedReference}</div>
            <button
              onClick={() => {
                if (confirmedReference) {
                  navigator.clipboard.writeText(confirmedReference);
                  setCopiedRef(true);
                  setTimeout(() => setCopiedRef(false), 2000);
                }
              }}
              className="text-xs text-[#8B95A5] hover:text-[#F6F2E9] inline-flex items-center space-x-1"
            >
              {copiedRef ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedRef ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="pt-2 flex justify-center space-x-3 text-xs">
            <button
              onClick={() => router.push(`/#after-party`)}
              className="px-4 py-2 rounded bg-[#C9A96E] text-[#07111F] font-semibold"
            >
              Request Party Songs
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded bg-[#101E33] text-[#F6F2E9] border border-[#1F304B]"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
