import { db } from '@/lib/db';
import { DjManagementClient } from '@/components/admin/DjManagementClient';

export default async function AdminDjPage() {
  const songs = await db.getAllSongs();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <DjManagementClient initialSongs={songs} />
    </div>
  );
}
