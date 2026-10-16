import {
  ConferenceSettings,
  Committee,
  Country,
  CommitteeCountry,
  Delegate,
  CountryAllocation,
  Payment,
  SongSubmission,
  FAQ,
  AuditLog,
  SuggestionSubmission,
} from '@/types/database';
import { generateReferenceCode, generateReservationToken, hashToken } from '../utils';

// ============================================================================
// IN-MEMORY / PROCESS-SAFE SEEDED STORE FOR INSTANT USABILITY & TESTING
// ============================================================================

const DEFAULT_SETTINGS: ConferenceSettings = {
  id: 'conf-settings-001',
  conference_name: 'Fluorescent Model United Nations',
  short_name: 'FMUN',
  year: 2026,
  theme: null, // Intentionally unconfirmed
  tagline: 'Where Nations Meet. Ideas Move.',
  description:
    'Fluorescent Model United Nations (FMUN) 2026 is the inaugural diplomatic simulation conference hosted by Fluorescent Secondary School in Kathmandu, Nepal.',
  start_date: null, // Unconfirmed
  end_date: null, // Unconfirmed
  venue: null, // Unconfirmed
  registration_fee: null, // Unconfirmed: paid registration cannot open until set
  currency: 'NPR',
  registration_open: false, // Strict gate: false until published
  registration_deadline: null,
  contact_email: null,
  contact_phone: null,
  address: 'Fluorescent Secondary School, Banasthali, Kathmandu, Nepal',
  social_facebook: null,
  social_instagram: null,
  social_linkedin: null,
  logo_url: null,
  delegate_handbook_url: null,
  rules_content: null,
  schedule_content: null,
  about_content:
    'Fluorescent Model United Nations is designed to bring together aspiring young leaders, thinkers, and diplomats across Kathmandu and beyond. Participants engage in intense committee debate, drafting binding resolutions and mastering parliamentary procedure.',
  physical_payment_instructions:
    'Cash payments can be submitted at the Fluorescent Secondary School administration office. You will receive an official physical receipt acknowledging your reference code.',
  digital_payment_instructions:
    'You can pay securely via eSewa, Khalti, or direct bank transfer. Keep your transaction reference code for verification.',
  esewa_enabled: true,
  khalti_enabled: true,
  physical_enabled: true,
  manual_transfer_enabled: true,
  song_submissions_public: true,
  schedule_items: [
    {
      id: 'sch-1',
      day: 1,
      time: '08:30 AM - 09:30 AM',
      title: 'Registration & Delegate Kit Distribution',
      desc: 'Pick up your official badge, country placard, research handbook, and stationery.',
      tag: 'Check-in',
    },
    {
      id: 'sch-2',
      day: 1,
      time: '09:30 AM - 10:30 AM',
      title: 'Opening Ceremony & Secretariat Welcome',
      desc: 'Opening address by school leadership and introduction of the Executive Board.',
      tag: 'Plenary',
    },
    {
      id: 'sch-3',
      day: 1,
      time: '10:30 AM - 01:00 PM',
      title: 'Committee Session I: Agenda Setting & General Debate',
      desc: 'Roll call, setting the primary agenda, and opening statements.',
      tag: 'Debate',
    },
    {
      id: 'sch-4',
      day: 1,
      time: '01:00 PM - 02:00 PM',
      title: 'Lunch & Informal Lobbying',
      desc: 'Lunch provided at the school cafeteria. Connect with fellow delegates.',
      tag: 'Meal',
    },
    {
      id: 'sch-5',
      day: 1,
      time: '02:00 PM - 04:30 PM',
      title: 'Committee Session II: Moderated Caucus',
      desc: 'Structured debate on working papers and sub-issues.',
      tag: 'Debate',
    },
    {
      id: 'sch-6',
      day: 2,
      time: '09:00 AM - 11:30 AM',
      title: 'Committee Session III: Working Papers & Bloc Debates',
      desc: 'Formation of draft resolution blocs and clause writing.',
      tag: 'Debate',
    },
    {
      id: 'sch-7',
      day: 2,
      time: '11:30 AM - 01:00 PM',
      title: 'Committee Session IV: Moderated & Unmoderated Caucuses',
      desc: 'Active negotiations across blocs to finalize draft papers.',
      tag: 'Debate',
    },
    {
      id: 'sch-8',
      day: 2,
      time: '01:00 PM - 02:00 PM',
      title: 'Delegate Lunch',
      desc: 'Lunch and informal strategy discussions with committee peers.',
      tag: 'Meal',
    },
    {
      id: 'sch-9',
      day: 2,
      time: '02:00 PM - 04:30 PM',
      title: 'Committee Session V: Amendments & Review',
      desc: 'Reviewing proposed amendments to draft resolutions before final voting.',
      tag: 'Debate',
    },
    {
      id: 'sch-10',
      day: 3,
      time: '09:00 AM - 11:30 AM',
      title: 'Committee Session VI: Crisis Simulation',
      desc: 'Urgent crisis scenario introduced by the Executive Board.',
      tag: 'Crisis',
    },
    {
      id: 'sch-11',
      day: 3,
      time: '11:30 AM - 01:00 PM',
      title: 'Committee Session VII: Substantive Resolution Voting',
      desc: 'Formal roll-call voting on final draft resolutions.',
      tag: 'Voting',
    },
    {
      id: 'sch-12',
      day: 3,
      time: '01:00 PM - 02:00 PM',
      title: 'Delegate Lunch & Official Photos',
      desc: 'Lunch and committee photo session.',
      tag: 'Meal',
    },
    {
      id: 'sch-13',
      day: 3,
      time: '02:30 PM - 04:00 PM',
      title: 'Closing Plenary & Awards Ceremony',
      desc: 'Presentation of delegate awards and certificates.',
      tag: 'Awards',
    },
    {
      id: 'sch-14',
      day: 3,
      time: '04:30 PM - 07:30 PM',
      title: 'FMUN 2026 Closing Party',
      desc: 'Celebration featuring student-recommended party songs, snacks, and music.',
      tag: 'Social',
      highlight: true,
    },
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Seed normalized UN countries
const SEED_COUNTRIES: Country[] = [
  { id: 'c-np', name: 'Nepal', display_name: 'Nepal', code: 'NP', flag_emoji: '🇳🇵', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-in', name: 'India', display_name: 'India', code: 'IN', flag_emoji: '🇮🇳', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-cn', name: 'China', display_name: "People's Republic of China", code: 'CN', flag_emoji: '🇨🇳', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-us', name: 'United States', display_name: 'United States of America', code: 'US', flag_emoji: '🇺🇸', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-gb', name: 'United Kingdom', display_name: 'United Kingdom', code: 'GB', flag_emoji: '🇬🇧', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-fr', name: 'France', display_name: 'France', code: 'FR', flag_emoji: '🇫🇷', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-ru', name: 'Russia', display_name: 'Russian Federation', code: 'RU', flag_emoji: '🇷🇺', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-de', name: 'Germany', display_name: 'Germany', code: 'DE', flag_emoji: '🇩🇪', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-jp', name: 'Japan', display_name: 'Japan', code: 'JP', flag_emoji: '🇯🇵', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-bd', name: 'Bangladesh', display_name: 'Bangladesh', code: 'BD', flag_emoji: '🇧🇩', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-bt', name: 'Bhutan', display_name: 'Bhutan', code: 'BT', flag_emoji: '🇧🇹', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-lk', name: 'Sri Lanka', display_name: 'Sri Lanka', code: 'LK', flag_emoji: '🇱🇰', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-pk', name: 'Pakistan', display_name: 'Pakistan', code: 'PK', flag_emoji: '🇵🇰', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-br', name: 'Brazil', display_name: 'Brazil', code: 'BR', flag_emoji: '🇧🇷', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-za', name: 'South Africa', display_name: 'South Africa', code: 'ZA', flag_emoji: '🇿🇦', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-au', name: 'Australia', display_name: 'Australia', code: 'AU', flag_emoji: '🇦🇺', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-ca', name: 'Canada', display_name: 'Canada', code: 'CA', flag_emoji: '🇨🇦', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-kr', name: 'South Korea', display_name: 'Republic of Korea', code: 'KR', flag_emoji: '🇰🇷', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-id', name: 'Indonesia', display_name: 'Indonesia', code: 'ID', flag_emoji: '🇮🇩', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-sa', name: 'Saudi Arabia', display_name: 'Saudi Arabia', code: 'SA', flag_emoji: '🇸🇦', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-eg', name: 'Egypt', display_name: 'Egypt', code: 'EG', flag_emoji: '🇪🇬', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-tr', name: 'Turkey', display_name: 'Türkiye', code: 'TR', flag_emoji: '🇹🇷', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-ch', name: 'Switzerland', display_name: 'Switzerland', code: 'CH', flag_emoji: '🇨🇭', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-se', name: 'Sweden', display_name: 'Sweden', code: 'SE', flag_emoji: '🇸🇪', is_active: true, created_at: new Date().toISOString() },
  { id: 'c-ae', name: 'United Arab Emirates', display_name: 'United Arab Emirates', code: 'AE', flag_emoji: '🇦🇪', is_active: true, created_at: new Date().toISOString() },
];

const SEED_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is FMUN 2026?',
    answer:
      'Fluorescent Model United Nations (FMUN) 2026 is the inaugural educational diplomatic simulation organized by Fluorescent Secondary School in Kathmandu. Delegates debate global issues, draft resolutions, and forge multilateral compromises.',
    category: 'General',
    display_order: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-2',
    question: 'When will conference dates and registration fees be finalized?',
    answer:
      'The organizing secretariat is finalizing the academic schedule and institutional venue. Dates, confirmed theme, and registration fees will be officially published on this portal once approved by the secretariat.',
    category: 'Conference Details',
    display_order: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-3',
    question: 'How does country allocation work?',
    answer:
      'Delegates can either choose an available country from their committee roster or use the random generator. Once selected, your country is temporarily held for 15 minutes while you submit your details.',
    category: 'Registration',
    display_order: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-4',
    question: 'What payment methods are supported in Nepal?',
    answer:
      'We support physical counter payments at the Fluorescent Secondary School administration desk, as well as digital payments through eSewa, Khalti, and direct bank transfers.',
    category: 'Payment',
    display_order: 4,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-5',
    question: 'How do song recommendations for the party work?',
    answer:
      'All delegates can recommend songs through our party song recommendation portal to be played during the closing party celebration.',
    category: 'Party',
    display_order: 5,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Persistent state singleton for the Node/Next process
class DatabaseRepository {
  private settings: ConferenceSettings = { ...DEFAULT_SETTINGS };
  private committees: Committee[] = [];
  private countries: Country[] = [...SEED_COUNTRIES];
  private committeeCountries: CommitteeCountry[] = [];
  private delegates: Delegate[] = [];
  private allocations: CountryAllocation[] = [];
  private payments: Payment[] = [];
  private songSubmissions: SongSubmission[] = [];
  private faqs: FAQ[] = [...SEED_FAQS];
  private auditLogs: AuditLog[] = [];
  private suggestions: SuggestionSubmission[] = [];

  constructor() {
    this.initDefaultCommittees();
  }

  // Set up baseline committees so the country picker and registration have active committees to test
  private initDefaultCommittees() {
    const ungaId = 'comm-unga-01';
    const unscId = 'comm-unsc-02';
    const unhrcId = 'comm-unhrc-03';

    this.committees = [
      {
        id: ungaId,
        name: 'United Nations General Assembly',
        acronym: 'UNGA',
        description:
          'The main policy-making organ of the United Nations, bringing together all sovereign member states for deliberative multilateral debate.',
        agenda: 'To be announced by the Executive Board',
        capacity: 35,
        is_open: true,
        eligibility_requirements: 'Open to secondary and higher secondary delegates',
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: unscId,
        name: 'United Nations Security Council',
        acronym: 'UNSC',
        description:
          'Charged with the maintenance of international peace and security, addressing urgent global crises and non-proliferation.',
        agenda: 'To be announced by the Executive Board',
        capacity: 15,
        is_open: true,
        eligibility_requirements: 'Prior MUN experience recommended',
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: unhrcId,
        name: 'United Nations Human Rights Council',
        acronym: 'UNHRC',
        description:
          'Responsible for promoting and protecting all human rights around the globe and addressing situations of human rights violations.',
        agenda: 'To be announced by the Executive Board',
        capacity: 25,
        is_open: true,
        eligibility_requirements: 'Open to all registered delegates',
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Map seed countries to UNGA and UNSC
    this.countries.forEach((country) => {
      this.committeeCountries.push({
        id: `cc-unga-${country.id}`,
        committee_id: ungaId,
        country_id: country.id,
        is_active: true,
        created_at: new Date().toISOString(),
      });
    });

    // P5 + select members in UNSC
    const unscCodes = ['US', 'GB', 'FR', 'RU', 'CN', 'JP', 'IN', 'BR', 'DE', 'AE'];
    this.countries
      .filter((c) => unscCodes.includes(c.code))
      .forEach((country) => {
        this.committeeCountries.push({
          id: `cc-unsc-${country.id}`,
          committee_id: unscId,
          country_id: country.id,
          is_active: true,
          created_at: new Date().toISOString(),
        });
      });
  }

  // --------------------------------------------------------------------------
  // CONFERENCE SETTINGS
  // --------------------------------------------------------------------------
  public async getSettings(): Promise<ConferenceSettings> {
    return { ...this.settings };
  }

  public async updateSettings(updates: Partial<ConferenceSettings>, adminUserId?: string): Promise<ConferenceSettings> {
    this.settings = {
      ...this.settings,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    await this.logAudit({
      user_id: adminUserId || null,
      action: 'UPDATE_CONFERENCE_SETTINGS',
      entity_type: 'conference_settings',
      entity_id: this.settings.id,
      details: updates,
    });
    return { ...this.settings };
  }

  // --------------------------------------------------------------------------
  // COMMITTEES & COUNTRIES
  // --------------------------------------------------------------------------
  public async getCommittees(): Promise<Committee[]> {
    return [...this.committees].sort((a, b) => a.display_order - b.display_order);
  }

  public async getCommitteeById(id: string): Promise<Committee | null> {
    const committee = this.committees.find((c) => c.id === id);
    return committee ? { ...committee } : null;
  }

  public async saveCommittee(data: Partial<Committee> & { name: string; acronym: string }): Promise<Committee> {
    if (data.id) {
      const idx = this.committees.findIndex((c) => c.id === data.id);
      if (idx !== -1) {
        this.committees[idx] = {
          ...this.committees[idx],
          ...data,
          updated_at: new Date().toISOString(),
        };
        return { ...this.committees[idx] };
      }
    }

    const newCommittee: Committee = {
      id: data.id || `comm-${Date.now()}`,
      name: data.name,
      acronym: data.acronym,
      description: data.description || null,
      agenda: data.agenda || null,
      capacity: data.capacity || 30,
      is_open: data.is_open ?? true,
      eligibility_requirements: data.eligibility_requirements || null,
      display_order: data.display_order || this.committees.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.committees.push(newCommittee);
    return { ...newCommittee };
  }

  public async getCountries(): Promise<Country[]> {
    return [...this.countries].sort((a, b) => a.name.localeCompare(b.name));
  }

  public async getCommitteeCountries(committeeId: string): Promise<{ country: Country; status: 'available' | 'held' | 'assigned' }[]> {
    this.cleanExpiredHolds();

    const mappings = this.committeeCountries.filter(
      (cc) => cc.committee_id === committeeId && cc.is_active
    );

    const countryIds = new Set(mappings.map((m) => m.country_id));
    const eligibleCountries = this.countries.filter((c) => countryIds.has(c.id) && c.is_active);

    return eligibleCountries.map((c) => {
      const activeAlloc = this.allocations.find(
        (a) =>
          a.committee_id === committeeId &&
          a.country_id === c.id &&
          (a.status === 'assigned' || (a.status === 'held' && new Date(a.reservation_expiry || 0) > new Date()))
      );

      let status: 'available' | 'held' | 'assigned' = 'available';
      if (activeAlloc) {
        status = activeAlloc.status === 'assigned' ? 'assigned' : 'held';
      }

      return {
        country: { ...c },
        status,
      };
    });
  }

  // --------------------------------------------------------------------------
  // ATOMIC RESERVATION & ALLOCATION LOGIC
  // --------------------------------------------------------------------------
  private cleanExpiredHolds() {
    const now = new Date();
    this.allocations.forEach((alloc) => {
      if (alloc.status === 'held' && alloc.reservation_expiry && new Date(alloc.reservation_expiry) <= now) {
        alloc.status = 'expired';
        alloc.released_at = now.toISOString();
        alloc.updated_at = now.toISOString();
      }
    });
  }

  public async reserveCountry(
    committeeId: string,
    countryId: string,
    holdMinutes = 15
  ): Promise<{ success: boolean; allocationId?: string; token?: string; expiry?: string; message?: string }> {
    this.cleanExpiredHolds();

    // Verify country is mapped to committee
    const isMapped = this.committeeCountries.some(
      (cc) => cc.committee_id === committeeId && cc.country_id === countryId && cc.is_active
    );
    if (!isMapped) {
      return { success: false, message: 'Country is not eligible for this committee.' };
    }

    // Check for active allocation
    const existing = this.allocations.find(
      (a) =>
        a.committee_id === committeeId &&
        a.country_id === countryId &&
        (a.status === 'assigned' || (a.status === 'held' && new Date(a.reservation_expiry || 0) > new Date()))
    );

    if (existing) {
      return { success: false, message: 'This country is already held or assigned.' };
    }

    const token = generateReservationToken();
    const tokenHash = hashToken(token);
    const expiry = new Date(Date.now() + holdMinutes * 60 * 1000).toISOString();
    const allocationId = `alloc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newAlloc: CountryAllocation = {
      id: allocationId,
      committee_id: committeeId,
      country_id: countryId,
      delegate_id: null,
      status: 'held',
      reservation_token_hash: tokenHash,
      reservation_expiry: expiry,
      assigned_at: null,
      released_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.allocations.push(newAlloc);

    return {
      success: true,
      allocationId,
      token,
      expiry,
    };
  }

  public async generateRandomCountry(
    committeeId: string,
    holdMinutes = 15
  ): Promise<{
    success: boolean;
    country?: Country;
    allocationId?: string;
    token?: string;
    expiry?: string;
    message?: string;
  }> {
    this.cleanExpiredHolds();

    const countryAvailability = await this.getCommitteeCountries(committeeId);
    const available = countryAvailability.filter((ca) => ca.status === 'available');

    if (available.length === 0) {
      return {
        success: false,
        message: 'No countries are currently available in this committee.',
      };
    }

    // Random selection
    const randomIndex = Math.floor(Math.random() * available.length);
    const chosen = available[randomIndex].country;

    const reservation = await this.reserveCountry(committeeId, chosen.id, holdMinutes);
    if (!reservation.success) {
      return { success: false, message: reservation.message };
    }

    return {
      success: true,
      country: chosen,
      allocationId: reservation.allocationId,
      token: reservation.token,
      expiry: reservation.expiry,
    };
  }

  public async releaseHold(allocationId: string, token: string): Promise<boolean> {
    const tokenHash = hashToken(token);
    const alloc = this.allocations.find(
      (a) => a.id === allocationId && a.status === 'held' && a.reservation_token_hash === tokenHash
    );

    if (alloc) {
      alloc.status = 'released';
      alloc.released_at = new Date().toISOString();
      alloc.updated_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Find or normalize country input
  public findCountryByInput(input: string): Country | null {
    if (!input || !input.trim()) return null;
    const clean = input.trim().toLowerCase().replace(/^(the|republic of|kingdom of|state of)\s+/i, '');

    const aliases: Record<string, string> = {
      'usa': 'United States',
      'us': 'United States',
      'america': 'United States',
      'united states of america': 'United States',
      'uk': 'United Kingdom',
      'britain': 'United Kingdom',
      'great britain': 'United Kingdom',
      'england': 'United Kingdom',
      'uae': 'United Arab Emirates',
      'emirates': 'United Arab Emirates',
      'russia': 'Russia',
      'russian federation': 'Russia',
      'south korea': 'South Korea',
      'republic of korea': 'South Korea',
      'north korea': 'North Korea',
      'dprk': 'North Korea',
      'prc': 'China',
      'china': 'China',
      'turkey': 'Turkey',
      'turkiye': 'Turkey',
      'türkiye': 'Turkey',
    };

    const targetName = aliases[clean] || clean;

    // Exact match by name, display_name, or code
    const exact = this.countries.find(
      (c) =>
        c.name.toLowerCase() === targetName.toLowerCase() ||
        c.display_name.toLowerCase() === targetName.toLowerCase() ||
        c.code.toLowerCase() === clean
    );
    if (exact) return exact;

    // Partial match
    const partial = this.countries.find(
      (c) =>
        c.name.toLowerCase().includes(targetName.toLowerCase()) ||
        c.display_name.toLowerCase().includes(targetName.toLowerCase())
    );
    if (partial) return partial;

    // If it has at least 3 letters, dynamically register it as a sovereign UN country
    if (clean.length >= 3) {
      const formattedName = input
        .trim()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      const code = formattedName.substring(0, 2).toUpperCase();
      const newCountry: Country = {
        id: `c-${code.toLowerCase()}-${Date.now().toString(36).substring(2, 6)}`,
        name: formattedName,
        display_name: formattedName,
        code: code,
        flag_emoji: '🌐',
        is_active: true,
        created_at: new Date().toISOString(),
      };
      this.countries.push(newCountry);
      return newCountry;
    }

    return null;
  }

  public async checkCountryAvailability(
    committeeId: string,
    countryInput: string
  ): Promise<{
    recognized: boolean;
    country?: Country;
    available?: boolean;
    message?: string;
  }> {
    this.cleanExpiredHolds();
    const country = this.findCountryByInput(countryInput);
    if (!country) {
      return {
        recognized: false,
        message: 'Country not recognized. Please check your spelling.',
      };
    }

    // Check if this country is currently assigned or held in this committee
    const existing = this.allocations.find(
      (a) =>
        a.committee_id === committeeId &&
        a.country_id === country.id &&
        (a.status === 'assigned' || (a.status === 'held' && new Date(a.reservation_expiry || 0) > new Date()))
    );

    if (existing) {
      return {
        recognized: true,
        country,
        available: false,
        message: `${country.name} is already chosen or held in this committee. Please type another country.`,
      };
    }

    return {
      recognized: true,
      country,
      available: true,
      message: `${country.name} is available!`,
    };
  }

  public async reserveCountryByTypedName(
    committeeId: string,
    countryInput: string,
    holdMinutes = 15
  ): Promise<{
    success: boolean;
    country?: Country;
    allocationId?: string;
    token?: string;
    expiry?: string;
    message?: string;
  }> {
    const check = await this.checkCountryAvailability(committeeId, countryInput);
    if (!check.recognized || !check.country) {
      return { success: false, message: check.message || 'Country not recognized.' };
    }
    if (!check.available) {
      return { success: false, message: check.message || 'Country is already taken in this committee.' };
    }

    // Ensure committee_country mapping exists
    const hasCC = this.committeeCountries.some(
      (cc) => cc.committee_id === committeeId && cc.country_id === check.country!.id
    );
    if (!hasCC) {
      this.committeeCountries.push({
        id: `cc-${committeeId}-${check.country.id}`,
        committee_id: committeeId,
        country_id: check.country.id,
        status: 'available',
        is_priority: false,
        is_active: true,
        created_at: new Date().toISOString(),
      });
    }

    const res = await this.reserveCountry(committeeId, check.country.id, holdMinutes);
    if (!res.success) {
      return { success: false, message: res.message };
    }

    return {
      success: true,
      country: check.country,
      allocationId: res.allocationId,
      token: res.token,
      expiry: res.expiry,
    };
  }


  // --------------------------------------------------------------------------
  // DELEGATE REGISTRATION & PAYMENT
  // --------------------------------------------------------------------------
  public async createRegistration(data: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    academicLevel?: string | null;
    committeeId: string;
    countryId: string;
    allocationId: string;
    reservationToken: string;
    paymentMethod: Payment['payment_method'];
    transactionReference?: string | null;
    receiptFilePath?: string | null;
  }): Promise<{ success: boolean; referenceCode?: string; delegate?: Delegate; payment?: Payment; message?: string }> {
    this.cleanExpiredHolds();

    // Verify registration is officially open
    if (!this.settings.registration_open) {
      return {
        success: false,
        message: 'Registration is not currently open. Please check back when dates and fees are announced.',
      };
    }

    // Verify allocation hold
    const tokenHash = hashToken(data.reservationToken);
    const alloc = this.allocations.find(
      (a) =>
        a.id === data.allocationId &&
        a.committee_id === data.committeeId &&
        a.country_id === data.countryId &&
        a.status === 'held'
    );

    if (!alloc) {
      return {
        success: false,
        message: 'Reservation hold not found or already assigned/released.',
      };
    }

    if (alloc.reservation_expiry && new Date(alloc.reservation_expiry) <= new Date()) {
      alloc.status = 'expired';
      return {
        success: false,
        message: 'Your country reservation expired. Please pick or generate a country again.',
      };
    }

    if (alloc.reservation_token_hash !== tokenHash) {
      return {
        success: false,
        message: 'Invalid reservation verification token.',
      };
    }

    // Check duplicate active registration by email or phone
    const emailNorm = data.email.trim().toLowerCase();
    const phoneNorm = data.phone.trim();
    const duplicate = this.delegates.find(
      (d) =>
        (d.email_normalized === emailNorm || d.phone_normalized === phoneNorm) &&
        (d.status === 'pending' || d.status === 'confirmed')
    );

    if (duplicate) {
      return {
        success: false,
        message: `An active registration already exists for ${data.email} or ${data.phone}. Reference: ${duplicate.reference_code}`,
      };
    }

    const delegateId = `del-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const referenceCode = generateReferenceCode();

    const newDelegate: Delegate = {
      id: delegateId,
      reference_code: referenceCode,
      full_name: data.fullName,
      email: data.email,
      email_normalized: emailNorm,
      phone: data.phone,
      phone_normalized: phoneNorm,
      institution: data.institution,
      academic_level: data.academicLevel || null,
      committee_id: data.committeeId,
      status: 'pending',
      notes: null,
      consent_given_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Promote country allocation from 'held' to 'assigned'
    alloc.status = 'assigned';
    alloc.delegate_id = delegateId;
    alloc.assigned_at = new Date().toISOString();
    alloc.reservation_token_hash = null; // Clear token hash on successful commit
    alloc.updated_at = new Date().toISOString();

    // Server-calculated fee strictly from settings
    const feeAmount = this.settings.registration_fee || 0;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      delegate_id: delegateId,
      amount: feeAmount,
      currency: this.settings.currency || 'NPR',
      payment_method: data.paymentMethod,
      provider: data.paymentMethod,
      status: 'pending',
      transaction_reference: data.transactionReference || null,
      receipt_file_path: data.receiptFilePath || null,
      verified_by: null,
      verified_at: null,
      rejection_reason: null,
      provider_metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.delegates.push(newDelegate);
    this.payments.push(newPayment);

    await this.logAudit({
      user_id: null,
      action: 'NEW_DELEGATE_REGISTRATION',
      entity_type: 'delegates',
      entity_id: delegateId,
      details: { referenceCode, committeeId: data.committeeId, countryId: data.countryId },
    });

    return {
      success: true,
      referenceCode,
      delegate: { ...newDelegate },
      payment: { ...newPayment },
    };
  }

  public async getDelegateByReference(
    referenceCode: string
  ): Promise<{
    delegate: Delegate;
    committee: Committee | null;
    country: Country | null;
    payment: Payment | null;
  } | null> {
    const delegate = this.delegates.find((d) => d.reference_code === referenceCode);
    if (!delegate) return null;

    const committee = this.committees.find((c) => c.id === delegate.committee_id) || null;
    const alloc = this.allocations.find((a) => a.delegate_id === delegate.id && a.status === 'assigned');
    const country = alloc ? this.countries.find((c) => c.id === alloc.country_id) || null : null;
    const payment = this.payments.find((p) => p.delegate_id === delegate.id) || null;

    return {
      delegate: { ...delegate },
      committee: committee ? { ...committee } : null,
      country: country ? { ...country } : null,
      payment: payment ? { ...payment } : null,
    };
  }

  // --------------------------------------------------------------------------
  // ADMIN DASHBOARD & METRICS
  // --------------------------------------------------------------------------
  public async getAdminOverviewMetrics() {
    this.cleanExpiredHolds();

    const totalRegistrations = this.delegates.length;
    const confirmedDelegates = this.delegates.filter((d) => d.status === 'confirmed').length;
    const pendingRegistrations = this.delegates.filter((d) => d.status === 'pending').length;
    const paymentsAwaitingVerification = this.payments.filter((p) => p.status === 'pending').length;

    const verifiedRevenue = this.payments
      .filter((p) => p.status === 'verified')
      .reduce((sum, p) => sum + p.amount, 0);

    const assignedCountries = this.allocations.filter((a) => a.status === 'assigned').length;
    const heldCountries = this.allocations.filter((a) => a.status === 'held').length;
    const pendingSongs = this.songSubmissions.filter((s) => s.status === 'pending').length;

    return {
      totalRegistrations,
      confirmedDelegates,
      pendingRegistrations,
      paymentsAwaitingVerification,
      verifiedRevenue,
      assignedCountries,
      heldCountries,
      pendingSongs,
    };
  }

  public async getAllDelegatesWithDetails() {
    return this.delegates.map((d) => {
      const committee = this.committees.find((c) => c.id === d.committee_id);
      const alloc = this.allocations.find((a) => a.delegate_id === d.id && a.status === 'assigned');
      const country = alloc ? this.countries.find((c) => c.id === alloc.country_id) : null;
      const payment = this.payments.find((p) => p.delegate_id === d.id);
      return {
        ...d,
        committeeName: committee?.name || 'Unassigned',
        committeeAcronym: committee?.acronym || 'N/A',
        countryName: country?.display_name || 'Unallocated',
        countryFlag: country?.flag_emoji || '🌐',
        paymentStatus: payment?.status || 'unrecorded',
        paymentMethod: payment?.payment_method || 'none',
        paymentAmount: payment?.amount || 0,
        paymentId: payment?.id,
        receiptFilePath: payment?.receipt_file_path,
        transactionReference: payment?.transaction_reference,
      };
    });
  }

  public async verifyPayment(
    paymentId: string,
    status: 'verified' | 'rejected',
    rejectionReason?: string | null,
    adminUserId?: string
  ): Promise<{ success: boolean; message: string }> {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) {
      return { success: false, message: 'Payment record not found.' };
    }

    payment.status = status;
    payment.verified_by = adminUserId || 'admin-system';
    payment.verified_at = new Date().toISOString();
    payment.rejection_reason = rejectionReason || null;
    payment.updated_at = new Date().toISOString();

    // Sync delegate status
    const delegate = this.delegates.find((d) => d.id === payment.delegate_id);
    if (delegate) {
      delegate.status = status === 'verified' ? 'confirmed' : 'rejected';
      delegate.updated_at = new Date().toISOString();
    }

    await this.logAudit({
      user_id: adminUserId || null,
      action: status === 'verified' ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
      entity_type: 'payments',
      entity_id: paymentId,
      details: { delegateId: payment.delegate_id, status, rejectionReason },
    });

    return { success: true, message: `Payment successfully marked as ${status}.` };
  }

  // --------------------------------------------------------------------------
  // SONG RECOMMENDATION PORTAL & DJ DASHBOARD
  // --------------------------------------------------------------------------
  public async submitSong(data: {
    title: string;
    artist: string;
    sourcePlatform: SongSubmission['source_platform'];
    sourceUrl: string;
    notes?: string | null;
    submitterName?: string | null;
    registrationReference?: string | null;
  }): Promise<{ success: boolean; id?: string; message: string }> {
    const id = `song-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newSong: SongSubmission = {
      id,
      title: data.title,
      artist: data.artist,
      source_platform: data.sourcePlatform,
      source_url: data.sourceUrl,
      notes: data.notes || null,
      submitter_name: data.submitterName || null,
      registration_reference: data.registrationReference || null,
      status: 'pending',
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.songSubmissions.unshift(newSong);

    return {
      success: true,
      id,
      message: 'Your song request has been submitted to the DJ for review!',
    };
  }

  public async getApprovedSongs(): Promise<SongSubmission[]> {
    return this.songSubmissions
      .filter((s) => s.status === 'approved' || s.status === 'played')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async getAllSongs(): Promise<SongSubmission[]> {
    return [...this.songSubmissions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public async updateSongStatus(
    songId: string,
    status: SongSubmission['status'],
    adminUserId?: string
  ): Promise<{ success: boolean; message: string }> {
    const song = this.songSubmissions.find((s) => s.id === songId);
    if (!song) {
      return { success: false, message: 'Song submission not found.' };
    }

    song.status = status;
    song.reviewed_by = adminUserId || 'dj-system';
    song.reviewed_at = new Date().toISOString();
    song.updated_at = new Date().toISOString();

    return { success: true, message: `Song marked as ${status}.` };
  }

  // --------------------------------------------------------------------------
  // FAQS
  // --------------------------------------------------------------------------
  public async getFaqs(): Promise<FAQ[]> {
    return [...this.faqs].sort((a, b) => a.display_order - b.display_order);
  }

  public async saveFaq(data: Partial<FAQ> & { question: string; answer: string }): Promise<FAQ> {
    if (data.id) {
      const idx = this.faqs.findIndex((f) => f.id === data.id);
      if (idx !== -1) {
        this.faqs[idx] = {
          ...this.faqs[idx],
          ...data,
          updated_at: new Date().toISOString(),
        };
        return { ...this.faqs[idx] };
      }
    }

    const newFaq: FAQ = {
      id: data.id || `faq-${Date.now()}`,
      question: data.question,
      answer: data.answer,
      category: data.category || 'General',
      display_order: data.display_order || this.faqs.length + 1,
      is_published: data.is_published ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.faqs.push(newFaq);
    return { ...newFaq };
  }

  public async deleteFaq(id: string): Promise<boolean> {
    const initLen = this.faqs.length;
    this.faqs = this.faqs.filter((f) => f.id !== id);
    return this.faqs.length < initLen;
  }

  // --------------------------------------------------------------------------
  // AUDIT LOGS
  // --------------------------------------------------------------------------
  public async logAudit(entry: {
    user_id: string | null;
    action: string;
    entity_type: string;
    entity_id?: string | null;
    details?: Record<string, unknown>;
    ip_address?: string | null;
  }) {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: entry.user_id,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id || null,
      details: entry.details || {},
      ip_address: entry.ip_address || null,
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
  }

  public async getAuditLogs(): Promise<AuditLog[]> {
    return [...this.auditLogs];
  }

  // --------------------------------------------------------------------------
  // SUGGESTIONS & IDEAS
  // --------------------------------------------------------------------------
  public async submitSuggestion(data: {
    name: string;
    faculty?: string;
    category: 'agenda' | 'crisis' | 'event' | 'general';
    title: string;
    details: string;
  }): Promise<SuggestionSubmission> {
    if (!this.suggestions) {
      this.suggestions = [];
    }
    const item: SuggestionSubmission = {
      id: `sug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name,
      faculty: data.faculty || '+2 Science',
      stream: data.faculty || '+2 Science',
      category: data.category,
      title: data.title,
      details: data.details,
      topic: data.title,
      idea: data.details,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    this.suggestions.unshift(item);
    return item;
  }

  public async getSuggestions(): Promise<SuggestionSubmission[]> {
    if (!this.suggestions) {
      this.suggestions = [];
    }
    return [...this.suggestions];
  }

  public async updateSuggestionStatus(id: string, status: 'new' | 'reviewed' | 'accepted'): Promise<boolean> {
    if (!this.suggestions) {
      this.suggestions = [];
    }
    const item = this.suggestions.find((s) => s.id === id);
    if (item) {
      item.status = status;
      return true;
    }
    return false;
  }
}


// Global persistent instance across Next.js re-renders in dev
declare global {
  // eslint-disable-next-line no-var
  var __fmun_db_repo: DatabaseRepository | undefined;
}

export const db = globalThis.__fmun_db_repo || new DatabaseRepository();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__fmun_db_repo = db;
}
