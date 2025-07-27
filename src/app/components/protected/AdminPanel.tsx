/**
 * Admin Panel component for managing users, roles, and assignments.
 * This component allows admins to view users, filter by roles, and assign trainees to trainers.
 * It includes a modal for assigning trainees to trainers.
 */
'use client';

// System Level Import
import { useState, useEffect, Suspense } from 'react';

// Library Level Import
import { Session } from 'next-auth';
import { toast } from 'react-toastify';

// Interface for Admin Panel Props
import { User as PrismaUser, Role } from '@prisma/client'; // Import User type from Prisma

// Extend the User type to include trainers and trainees relationships
type User = PrismaUser & {
  trainers?: { trainer: PrismaUser }[];
  trainees?: { trainee: PrismaUser }[];
};

interface AdminPanelProps {
    session: Session;
}


export default function AdminPanel({session}: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedTrainee, setSelectedTrainee] = useState('');

  useEffect(() => {
    // Ensure the user is an admin before fetching users
    // This check is important to prevent unauthorized access
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      toast.error('Admin access required to view this page! Please log in as an admin.');
      return;
    }
    fetch('/api/users/list')
      .then((res) => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  /**
   * Async function to assign a trainee to a trainer via POST request API
   * @returns {Promise<void>} Resolves when the assignment is successful
   * @throws {Error} If the assignment fails, an error message is displayed
   */
  const assign = async () => {
    const res = await fetch('/api/users/assign', {
      method: 'POST',
      body: JSON.stringify({ traineeId: selectedTrainee, trainerId: selectedTrainer }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) location.reload();
    else alert((await res.json()).error);
  };


  /**
   * Async function to unassign a trainee from a trainer via POST request API
   * @param traineeId {string} - The ID of the trainee to unassign
   * @param trainerId {string} - The ID of the trainer from whom the trainee should be unassigned
   * @returns {Promise<void>} Resolves when the unassignment is successful
   * @throws {Error} If the unassignment fails, an error message is displayed
   */
  const unassign = async (traineeId: string, trainerId: string) => {
    const res = await fetch('/api/users/unassign', {
      method: 'POST',
      body: JSON.stringify({ traineeId, trainerId }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) location.reload();
    else alert((await res.json()).error);
  };


  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">User Management Dashboard</h1>

      {/* Assign Form */}
      <div className="mb-6 p-4 border rounded-md">
        <h2 className="font-semibold mb-2">Assign Trainee to Trainer</h2>
        <div className="flex gap-4">
          <select
            className="border px-2 py-1"
            value={selectedTrainer}
            onChange={(e) => setSelectedTrainer(e.target.value)}
          >
            <option value="">Select Trainer</option>
            {users
              .filter((u) => u.role === 'TRAINER' || u.role === 'ADMIN')
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email}
                </option>
              ))}
          </select>

          <select
            className="border px-2 py-1"
            value={selectedTrainee}
            onChange={(e) => setSelectedTrainee(e.target.value)}
          >
            <option value="">Select Trainee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.email}
              </option>
            ))}
          </select>

          <button
            className="bg-blue-600 text-white px-4 py-1 rounded"
            onClick={assign}
            disabled={!selectedTrainer || !selectedTrainee}
          >
            Assign
          </button>
        </div>
      </div>

      {/* User Table */}
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Trainers</th>
            <th className="p-2 border">Trainees</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.name || u.email}</td>
              <td className="border p-2">
                <select
                  value={u.role}
                  onChange={async (e) => {
                    const newRole = e.target.value;
                    const res = await fetch('/api/users/role', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: u.id, newRole }),
                    });
                    if (res.ok) {
                      location.reload(); // Refresh data after role change
                    } else {
                      alert((await res.json()).error);
                    }
                  }}
                  className="border rounded px-2 py-1"
                >
                  {Object.values(Role).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                {u.trainers?.map(({ trainer }) => (
                  <div key={trainer.id} className="flex justify-between items-center">
                    <span>{trainer.name || trainer.email}</span>
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => unassign(u.id, trainer.id)}
                    >
                      Unassign
                    </button>
                  </div>
                )) || '—'}
              </td>
              <td className="border p-2">
                {u.trainees?.map(({ trainee }) => (
                  <div key={trainee.id} className="flex justify-between items-center">
                    <span>{trainee.name || trainee.email}</span>
                    <button
                      className="text-red-500 ml-2"
                      onClick={() => unassign(trainee.id, u.id)}
                    >
                      Unassign
                    </button>
                  </div>
                )) || '—'}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
