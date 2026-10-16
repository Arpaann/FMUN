import { db } from '@/lib/db';
import { FinanceManagementClient } from '@/components/admin/FinanceManagementClient';

export default async function AdminFinancePage() {
  const delegates = await db.getAllDelegatesWithDetails();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <FinanceManagementClient initialPayments={delegates} />
    </div>
  );
}
