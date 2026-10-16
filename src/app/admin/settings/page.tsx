import { db } from '@/lib/db';
import { SettingsManagementClient } from '@/components/admin/SettingsManagementClient';

export default async function AdminSettingsPage() {
  const settings = await db.getSettings();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SettingsManagementClient initialSettings={settings} />
    </div>
  );
}
