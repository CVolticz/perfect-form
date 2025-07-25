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

// import { useState, useEffect, useMemo } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { User } from '@prisma/client'; // Import User type from Prisma Client

// // Import shadcn/ui components (adjust paths based on your shadcn setup)
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';

// // Import custom components
// import UserCard from '@/app/components/admin/UserCard';
// import AssignTraineeModal from '@/app/components/admin/AssignTraineeModal';

// Extend the User type to include the relations fetched from the API for display
interface UserWithRelations extends User {
  trainerOf?: Array<{ trainee: { id: string; name: string | null } }>;
  traineeOf?: Array<{ trainer: { id: string; name: string | null } }>;
}


interface AdminPanelClientProps {
    session: Session;
}
  
export default function AdminPanel({ session }: AdminPanelClientProps) {
  const [users, setUsers] = useState<UserWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL'); // 'ALL', 'USER', 'TRAINER', 'ADMIN'

  // State for controlling the assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [traineeToAssign, setTraineeToAssign] = useState<UserWithRelations | null>(null);


  // Effect to fetch users and handle authorization on component mount
  useEffect(() => {
    
    // Function to fetch all users from the API
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error(`Failed to fetch users: ${res.statusText}`);
        }
        const data: UserWithRelations[] = await res.json();
        setUsers(data);
      } catch (err: any) {
        console.error('Failed to fetch users:', err);
        setError(err.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session, status, router]); // Re-run effect if session or status changes

  // Memoized filtered users based on the selected role
  const filteredUsers = useMemo(() => {
    if (selectedRoleFilter === 'ALL') {
      return users;
    }
    return users.filter(user => user.role === selectedRoleFilter);
  }, [users, selectedRoleFilter]);

  // Handler for when the "Assign to Trainer" button is clicked on a UserCard
  const handleAssignTraineeClick = (user: UserWithRelations) => {
    setTraineeToAssign(user); // Set the trainee to be assigned
    setShowAssignModal(true); // Open the assignment modal
  };

  // Callback function after a successful assignment in the modal
  const handleAssignmentSuccess = async () => {
    // Re-fetch all users to update the list and reflect the new assignment
    setLoading(true); // Show loading state
    setError(null); // Clear any previous errors
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error(`Failed to re-fetch users: ${res.statusText}`);
      }
      const data: UserWithRelations[] = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to re-fetch users after assignment:', err);
      setError(err.message || 'Failed to refresh users after assignment.');
    } finally {
      setLoading(false); // Hide loading state
      setShowAssignModal(false); // Close the modal
      setTraineeToAssign(null); // Clear the trainee being assigned
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Loading admin panel...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Fallback for unauthorized access (should be caught by redirect, but good for safety)
  if (!session || session.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">Admin Dashboard</h1>

      {/* Role Filter */}
      <div className="mb-8 flex justify-center">
        <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
          <SelectTrigger className="w-[200px] bg-white shadow-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-md border border-gray-200">
            <SelectItem value="ALL">All Users</SelectItem>
            <SelectItem value="USER">Users (Trainees)</SelectItem>
            <SelectItem value="TRAINER">Trainers</SelectItem>
            <SelectItem value="ADMIN">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg py-10">
            No users found for the selected role.
          </p>
        ) : (
          filteredUsers.map(user => (
            <UserCard key={user.id} user={user} onAssignTrainee={handleAssignTraineeClick} />
          ))
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignModal && traineeToAssign && (
        <AssignTraineeModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          trainee={traineeToAssign}
          trainers={trainers}
          onAssignSuccess={handleAssignmentSuccess}
        />
      )}
    </div>
  );
}