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
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Building,
  Mail,
  Phone,
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

  // Wizard Step: 1 to 5
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Personal Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [academicLevel, setAcademicLevel] = useState('Grade 11 / 12');

  // Step 2: Committee
  const [selectedCommitteeId, setSelectedCommitteeId] = useState(committees[0]?.id || '');

  // Step 3: Country Roster & Hold
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
  const [randomResultCountry, setRandomResultCountry] = useState<Country | null>(null);

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<'physical' | 'esewa' | 'khalti' | 'manual_transfer'>('physical');
  const [transactionReference, setTransactionReference] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 5: Submission & Confirmation
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
      .catch(() => {
        // Fallback: fetch from internal state
      })
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
        // Expired
        setSelectedCountryId(null);
        setAllocationId(null);
        setReservationToken(null);
        setReservationExpiry(null);
        setSubmitError('Your 15-minute country reservation expired. Please pick or generate a country again.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservationExpiry]);

  // Handle manual country selection
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
        setSubmitError(data.message || 'Country could not be reserved');
        return;
      }

      setSelectedCountryId(countryId);
      setAllocationId(data.allocationId);
      setReservationToken(data.token);
      setReservationExpiry(data.expiry);
      setRandomResultCountry(null);
    } catch {
      setSubmitError('Network error while reserving country. Please retry.');
    }
  };

  // Handle random country generator
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
      setRandomResultCountry(data.country);
    } catch {
      setSubmitError('Failed to generate random country. Please retry.');
    } finally {
      setRandomizing(false);
    }
  };

  // Handle Final Submission
  const handleSubmitRegistration = async () => {
    setSubmitError(null);

    if (!selectedCountryId || !allocationId || !reservationToken) {
      setSubmitError('Please select or generate a country before proceeding.');
      return;
    }

    if (!termsAccepted) {
      setSubmitError('You must agree to the FMUN rules and code of conduct.');
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
          academicLevel,
          committeeId: selectedCommitteeId,
          countryId: selectedCountryId,
          allocationId,
          reservationToken,
          paymentMethod,
          transactionReference: transactionReference || null,
          termsAccepted,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.message || 'Registration submission failed.');
        setIsSubmitting(false);
        return;
      }

      setConfirmedReference(data.referenceCode);
      setCurrentStep(5);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

      // If eSewa or Khalti redirect is required
      if (data.gatewayPayload) {
        if (data.gatewayPayload.type === 'khalti' && data.gatewayPayload.paymentUrl) {
          window.location.href = data.gatewayPayload.paymentUrl;
        }
      }
    } catch {
      setSubmitError('An unexpected server error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceCode = () => {
    if (confirmedReference) {
      navigator.clipboard.writeText(confirmedReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const selectedCommittee = committees.find((c) => c.id === selectedCommitteeId);
  const selectedCountry =
    randomResultCountry || committeeCountries.find((c) => c.country.id === selectedCountryId)?.country;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8">
      {/* Registration Gate Check */}
      {!settings.registration_open && currentStep < 5 && (
        <div className="mb-8 p-6 rounded-lg bg-[#101E33] border border-[#C9A96E]/40 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-[#07111F] text-[#C9A96E] border border-[#C9A96E]/30">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-serif-heading text-xl font-bold text-[#F6F2E9]">
            Official Registration Opening Soon
          </h3>
          <p className="text-xs text-[#8B95A5] max-w-lg mx-auto leading-relaxed">
            The Fluorescent Secondary School secretariat is currently configuring committee country pools and
            official delegate fees. You can preview the multi-step registration workflow and committee allocations
            below. Paid registration will officially unlock once finalized.
          </p>
        </div>
      )}

      {/* Wizard Step Navigation */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: 'Personal', icon: User },
            { step: 2, label: 'Committee', icon: Users },
            { step: 3, label: 'Country', icon: Globe },
            { step: 4, label: 'Payment', icon: CreditCard },
            { step: 5, label: 'Confirmed', icon: CheckCircle2 },
          ].map((item) => {
            const Icon = item.icon;
            const isCompleted = currentStep > item.step;
            const isCurrent = currentStep === item.step;

            return (
              <div key={item.step} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#C9A96E] text-[#07111F]'
                      : isCurrent
                      ? 'bg-[#101E33] text-[#C9A96E] border-2 border-[#C9A96E] shadow-lg shadow-[#C9A96E]/20'
                      : 'bg-[#0B1728] text-[#8B95A5] border border-[#1F304B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] mt-2 font-medium tracking-wider uppercase hidden sm:block ${
                    isCurrent ? 'text-[#C9A96E]' : isCompleted ? 'text-[#F6F2E9]' : 'text-[#8B95A5]'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Error Banner */}
      {submitError && (
        <div className="mb-6 p-4 rounded-md bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center space-x-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{submitError}</span>
        </div>
      )}

      {/* STEP 1: Personal Details */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-6">
          <div className="border-b border-[#1F304B] pb-4">
            <h2 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
              Step 1: Delegate Identity
            </h2>
            <p className="text-xs text-[#8B95A5] mt-1">
              Please enter your official participant credentials for committee rovers and credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-[#101E33] border border-[#1F304B] focus:border-[#C9A96E] text-[#F6F2E9] text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="delegate@school.edu.np"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-[#101E33] border border-[#1F304B] focus:border-[#C9A96E] text-[#F6F2E9] text-xs outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                Phone Number (Nepal +977) *
              </label>
              <input
                type="tel"
                required
                placeholder="+977 98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-[#101E33] border border-[#1F304B] focus:border-[#C9A96E] text-[#F6F2E9] text-xs outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                School or Institution *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fluorescent Secondary School"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-[#101E33] border border-[#1F304B] focus:border-[#C9A96E] text-[#F6F2E9] text-xs outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-medium text-[#F6F2E9] uppercase tracking-wider">
                Academic Level
              </label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-[#101E33] border border-[#1F304B] focus:border-[#C9A96E] text-[#F6F2E9] text-xs outline-none"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10 (SEE)</option>
                <option value="Grade 11 / 12">Grade 11 / 12 (+2)</option>
                <option value="A-Levels">A-Levels / IB</option>
                <option value="Undergraduate">Undergraduate / College</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (!fullName || !email || !phone || !institution) {
                  setSubmitError('Please complete all required fields.');
                  return;
                }
                setSubmitError(null);
                setCurrentStep(2);
              }}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Next: Select Committee</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Committee Selection */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-6">
          <div className="border-b border-[#1F304B] pb-4">
            <h2 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
              Step 2: Choose Your Committee
            </h2>
            <p className="text-xs text-[#8B95A5] mt-1">
              Select the United Nations organ or specialized agency you wish to represent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className={`p-5 rounded-lg cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-[#101E33] border-[#C9A96E] shadow-md shadow-[#C9A96E]/10'
                      : 'bg-[#07111F] border-[#1F304B] hover:border-[#1F304B]/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-heading font-bold text-xl text-[#C9A96E]">
                      {comm.acronym}
                    </span>
                    <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-[#0B1728] text-[#8B95A5] border border-[#1F304B]">
                      Capacity: {comm.capacity}
                    </span>
                  </div>
                  <h3 className="font-serif-heading font-medium text-base text-[#F6F2E9] mt-2">
                    {comm.name}
                  </h3>
                  <p className="text-xs text-[#8B95A5] mt-2 line-clamp-2 leading-relaxed">
                    {comm.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center space-x-1.5 text-xs text-[#8B95A5] hover:text-[#F6F2E9]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!selectedCommitteeId) {
                  setSubmitError('Please select a committee.');
                  return;
                }
                setSubmitError(null);
                setCurrentStep(3);
              }}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Next: Country Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Country Selection & Randomization */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-6">
          <div className="border-b border-[#1F304B] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
                Step 3: Country Allocation
              </h2>
              <p className="text-xs text-[#8B95A5] mt-1">
                Committee: <span className="text-[#C9A96E] font-semibold">{selectedCommittee?.name}</span>
              </p>
            </div>

            {/* Hold Timer Badge if Country is Reserved */}
            {reservationExpiry && secondsRemaining > 0 && (
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono">
                <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                <span>
                  Held for {Math.floor(secondsRemaining / 60)}:
                  {(secondsRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {/* Option B: Random Country Generator Bar */}
          <div className="p-5 rounded-lg bg-[#101E33] border border-[#C9A96E]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#C9A96E]">
                <Sparkles className="w-4 h-4 text-[#C9A96E]" />
                <span>Option B: Diplomatic Randomizer</span>
              </div>
              <p className="text-xs text-[#8B95A5]">
                Let the FMUN diplomatic allocation engine randomly assign an available country to you.
              </p>
            </div>

            <button
              type="button"
              disabled={randomizing}
              onClick={handleGenerateRandom}
              className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-semibold text-xs uppercase tracking-wider shadow-sm transition-all shrink-0"
            >
              <Shuffle className={`w-3.5 h-3.5 ${randomizing ? 'animate-spin' : ''}`} />
              <span>{randomizing ? 'Randomizing...' : 'Generate Random Country'}</span>
            </button>
          </div>

          {/* Current Selection / Reveal Box */}
          {selectedCountry && (
            <div className="p-4 rounded-md bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedCountry.flag_emoji || '🌐'}</span>
                <div>
                  <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                    Currently Reserved for You
                  </span>
                  <h4 className="font-serif-heading text-lg font-bold text-[#F6F2E9]">
                    {selectedCountry.display_name} ({selectedCountry.code})
                  </h4>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-medium">Temporary Hold Active</span>
            </div>
          )}

          {/* Option A: Country Selection Grid */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-[#8B95A5] font-semibold">
              Option A: Or Browse Available Countries
            </h3>

            {loadingCountries ? (
              <p className="text-xs text-[#8B95A5]">Loading live country matrix...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-2">
                {committeeCountries.map(({ country, status }) => {
                  const isAvailable = status === 'available';
                  const isSelected = selectedCountryId === country.id;

                  return (
                    <button
                      key={country.id}
                      type="button"
                      disabled={!isAvailable && !isSelected}
                      onClick={() => handleSelectCountry(country.id)}
                      className={`p-2.5 rounded text-left flex items-center space-x-2 text-xs border transition-all ${
                        isSelected
                          ? 'bg-[#C9A96E] text-[#07111F] font-semibold border-[#C9A96E]'
                          : isAvailable
                          ? 'bg-[#101E33] border-[#1F304B] text-[#F6F2E9] hover:border-[#C9A96E]/40'
                          : 'bg-[#07111F] border-[#1F304B]/30 text-[#8B95A5]/60 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span className="text-base">{country.flag_emoji || '🌐'}</span>
                      <span className="truncate">{country.display_name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center space-x-1.5 text-xs text-[#8B95A5] hover:text-[#F6F2E9]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!selectedCountryId || !allocationId) {
                  setSubmitError('Please choose or generate an available country before proceeding.');
                  return;
                }
                setSubmitError(null);
                setCurrentStep(4);
              }}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Next: Payment & Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Payment & Review */}
      {currentStep === 4 && (
        <div className="p-6 sm:p-8 rounded-xl bg-[#0B1728] border border-[#1F304B] space-y-6">
          <div className="border-b border-[#1F304B] pb-4">
            <h2 className="font-serif-heading text-2xl font-bold text-[#F6F2E9]">
              Step 4: Payment Method & Review
            </h2>
            <p className="text-xs text-[#8B95A5] mt-1">
              Confirmed Delegate Fee:{' '}
              <span className="text-[#C9A96E] font-bold">
                {formatNPR(settings.registration_fee)}
              </span>
            </p>
          </div>

          {/* Allocation Summary Card */}
          <div className="p-4 rounded-lg bg-[#101E33] border border-[#1F304B] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#8B95A5]">Delegate:</span>
              <p className="text-[#F6F2E9] font-medium mt-0.5">{fullName}</p>
            </div>
            <div>
              <span className="text-[#8B95A5]">Committee:</span>
              <p className="text-[#F6F2E9] font-medium mt-0.5">{selectedCommittee?.acronym}</p>
            </div>
            <div>
              <span className="text-[#8B95A5]">Country:</span>
              <p className="text-[#F6F2E9] font-medium mt-0.5">{selectedCountry?.display_name}</p>
            </div>
            <div>
              <span className="text-[#8B95A5]">Fee Due:</span>
              <p className="text-[#C9A96E] font-bold mt-0.5">
                {formatNPR(settings.registration_fee)}
              </p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#F6F2E9]">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Physical */}
              <div
                onClick={() => setPaymentMethod('physical')}
                className={`p-4 rounded-lg cursor-pointer border transition-all ${
                  paymentMethod === 'physical'
                    ? 'bg-[#101E33] border-[#C9A96E] shadow-sm'
                    : 'bg-[#07111F] border-[#1F304B]'
                }`}
              >
                <div className="font-semibold text-xs text-[#F6F2E9]">Physical Payment</div>
                <div className="text-[11px] text-[#8B95A5] mt-1">
                  Pay cash at Fluorescent School counter.
                </div>
              </div>

              {/* Option 2: eSewa */}
              <div
                onClick={() => setPaymentMethod('esewa')}
                className={`p-4 rounded-lg cursor-pointer border transition-all ${
                  paymentMethod === 'esewa'
                    ? 'bg-[#101E33] border-[#C9A96E] shadow-sm'
                    : 'bg-[#07111F] border-[#1F304B]'
                }`}
              >
                <div className="font-semibold text-xs text-emerald-400">eSewa ePay v2</div>
                <div className="text-[11px] text-[#8B95A5] mt-1">
                  Instant mobile wallet payment.
                </div>
              </div>

              {/* Option 3: Khalti */}
              <div
                onClick={() => setPaymentMethod('khalti')}
                className={`p-4 rounded-lg cursor-pointer border transition-all ${
                  paymentMethod === 'khalti'
                    ? 'bg-[#101E33] border-[#C9A96E] shadow-sm'
                    : 'bg-[#07111F] border-[#1F304B]'
                }`}
              >
                <div className="font-semibold text-xs text-purple-400">Khalti Gateway</div>
                <div className="text-[11px] text-[#8B95A5] mt-1">
                  Pay via Khalti app / web banking.
                </div>
              </div>
            </div>
          </div>

          {/* Physical Payment Notice */}
          {paymentMethod === 'physical' && (
            <div className="p-4 rounded-md bg-[#101E33] border border-[#1F304B] text-xs text-[#8B95A5] leading-relaxed">
              <strong className="text-[#F6F2E9]">Physical Payment Instructions: </strong>
              {settings.physical_payment_instructions}
            </div>
          )}

          {/* Terms Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-[#1F304B] text-[#C9A96E] focus:ring-[#C9A96E]"
              />
              <span className="text-xs text-[#8B95A5] leading-relaxed">
                I hereby verify that my submitted details are truthful, and I agree to abide by the official
                diplomatic rules of procedure and code of conduct of FMUN 2026.
              </span>
            </label>
          </div>

          <div className="pt-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center space-x-1.5 text-xs text-[#8B95A5] hover:text-[#F6F2E9]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitRegistration}
              className="inline-flex items-center space-x-2 px-7 py-3 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-bold text-xs uppercase tracking-widest shadow-md transition-all"
            >
              <span>{isSubmitting ? 'Confirming...' : 'Complete Registration'}</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Registration Confirmed */}
      {currentStep === 5 && (
        <div className="p-8 sm:p-12 rounded-xl bg-[#0B1728] border border-[#C9A96E]/40 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#C9A96E] font-semibold">
              Diplomatic Registration Confirmed
            </span>
            <h2 className="font-serif-heading text-3xl font-bold text-[#F6F2E9]">
              Welcome to FMUN 2026, Delegate
            </h2>
            <p className="text-xs text-[#8B95A5] max-w-md mx-auto">
              Your sovereign allocation and registration record have been permanently logged in the conference
              database.
            </p>
          </div>

          {/* Reference Box */}
          <div className="p-6 rounded-lg bg-[#101E33] border border-[#C9A96E]/30 max-w-md mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#8B95A5]">
              Unique Registration Reference Code
            </span>
            <div className="font-mono text-2xl font-bold text-[#C9A96E] tracking-wider">
              {confirmedReference}
            </div>
            <button
              type="button"
              onClick={copyReferenceCode}
              className="inline-flex items-center space-x-1.5 text-xs text-[#8B95A5] hover:text-[#F6F2E9] transition-colors"
            >
              {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRef ? 'Copied to Clipboard!' : 'Copy Reference Code'}</span>
            </button>
          </div>

          <div className="pt-4 flex justify-center space-x-4 text-xs">
            <button
              type="button"
              onClick={() => router.push(`/register/status/${confirmedReference}`)}
              className="px-5 py-2.5 rounded bg-[#C9A96E] hover:bg-[#DFCA9B] text-[#07111F] font-semibold uppercase tracking-wider"
            >
              View Registration Pass
            </button>
            <button
              type="button"
              onClick={() => router.push('/after-party/submit')}
              className="px-5 py-2.5 rounded bg-[#101E33] hover:bg-[#15253F] text-[#F6F2E9] border border-[#1F304B] uppercase tracking-wider"
            >
              Submit After-Party Song
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
