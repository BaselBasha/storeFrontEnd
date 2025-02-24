import ProtectedAdmin from '@/app/components/ProtectedAdmin';

export default function AdminDashboard() {
  return (
    <ProtectedAdmin>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
      </div>
    </ProtectedAdmin>
  );
}