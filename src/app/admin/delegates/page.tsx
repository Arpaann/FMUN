import { db } from '@/lib/db';
import { DelegateManagementClient } from '@/components/admin/DelegateManagementClient';

export default async function AdminDelegatesPage() {
  const delegates = await db.getAllDelegatesWithDetails();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <DelegateManagementClient initialDelegates={delegates} />
    </div>
  );
}
