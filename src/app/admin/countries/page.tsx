import { db } from '@/lib/db';
import { CountryManagementClient } from '@/components/admin/CountryManagementClient';

export default async function AdminCountriesPage() {
  const committees = await db.getCommittees();
  const committeeAllocations: Record<
    string,
    { country: { id: string; name: string; display_name: string; code: string; flag_emoji: string | null }; status: 'available' | 'held' | 'assigned' }[]
  > = {};

  for (const c of committees) {
    committeeAllocations[c.id] = await db.getCommitteeCountries(c.id);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <CountryManagementClient
        committees={committees}
        initialAllocations={committeeAllocations}
      />
    </div>
  );
}
