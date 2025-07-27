/**
 * Middleware for user management operations.
 * This includes fetching users, assigning trainees to trainers, and unassigning trainees.
 */
// Import 'Prisma' namespace which contains the model types and enums
import { prisma } from '@/lib/prisma';
import { User, Role } from '@prisma/client';

// --- Type Definitions ---

// Extend Prisma's User type to include the relations we're fetching
// This helps with type safety when working with the fetched data
export interface UserWithRelations extends User {
  // `trainees` is the relation where this user is a TRAINER
  trainees?: Array<{
    trainee: {
      id: string;
      name: string | null;
      email: string;
      role: Role;
    };
  }>;
  // `trainers` is the relation where this user is a TRAINEE
  trainers?: Array<{
    trainer: {
      id: string;
      name: string | null;
      email: string;
      role: Role;
    };
  }>;
}

// --- Data Retrieval Functions ---

/**
 * Fetches all users from the database, including their roles and
 * their current trainer/trainee assignments.
 *
 * @returns {Promise<UserWithRelations[]>} A list of users with their related assignments.
 * @throws {Error} If there's an issue fetching users from the database.
 */
export async function getAllUsersWithRolesAndAssignments(): Promise<UserWithRelations[]> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        // Include relations to show who they train (if they are a trainer)
        trainees: {
          select: {
            trainee: { // Select the actual trainee user details
              select: {
                id: true,
                name: true,
                email: true,
                role: true, // This will be inferred as Prisma.Role
              },
            },
          },
        },
        // Include relations to show who their trainer is (if they are a trainee)
        trainers: {
          select: {
            trainer: { // Select the actual trainer user details
              select: {
                id: true,
                name: true,
                email: true,
                role: true, // This will be inferred as Prisma.Role
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc', // Order by name for consistent display
      },
    });

    // Cast the result to the extended type for better type inference in consuming code
    return users as UserWithRelations[];
  } catch (error) {
    console.error('Error in getAllUsersWithRolesAndAssignments:', error);
    throw new Error('Failed to retrieve user data.');
  }
}

/**
 * Assigns a trainee to a trainer.
 * This function handles creating the assignment if it doesn't exist.
 *
 * @param {string} traineeId - The ID of the user to be assigned as a trainee.
 * @param {string} trainerId - The ID of the user to be assigned as a trainer.
 * @returns {Promise<Prisma.TrainerTraineeMap>} The created or existing assignment record.
 * @throws {Error} If the assignment fails due to validation or database error.
 */
export async function assignTraineeToTrainer(traineeId: string, trainerId: string) {
  // Basic validation
  if (!traineeId || !trainerId) {
    throw new Error('Trainee ID and Trainer ID are required for assignment.');
  }

  // Prevent assigning a user to themselves
  if (traineeId === trainerId) {
    throw new Error('Cannot assign a user to themselves.');
  }

  try {
    // Optional: Validate if trainer and trainee actually exist and have appropriate roles
    const [trainee, trainer] = await Promise.all([
      prisma.user.findUnique({ where: { id: traineeId } }),
      prisma.user.findUnique({ where: { id: trainerId } }),
    ]);

    if (!trainee) {
      throw new Error(`Trainee with ID ${traineeId} not found.`);
    }
    if (!trainer) {
      throw new Error(`Trainer with ID ${trainerId} not found.`);
    }

    // Ensure the selected trainer has the 'TRAINER' or 'ADMIN' role
    // Use Prisma.Role here
    if (trainer.role !== Role.TRAINER && trainer.role !== Role.ADMIN) {
      throw new Error('Selected user does not have a TRAINER or ADMIN role.');
    }

    // Use upsert to create the mapping if it doesn't exist.
    // The composite primary key `@@id([trainerId, traineeId])` in schema.prisma ensures no duplicates.
    const assignment = await prisma.trainerTraineeMap.upsert({
      where: {
        trainerId_traineeId: { // This refers to the composite primary key
          trainerId: trainerId,
          traineeId: traineeId,
        },
      },
      update: {}, // If the record exists, no update is needed for this simple assignment
      create: {
        trainerId: trainerId,
        traineeId: traineeId,
      },
    });

    return assignment;
  } catch (error: any) {
    console.error('Error in assignTraineeToTrainer:', error);
    // Re-throw specific errors or a generic one
    throw new Error(error.message || 'Failed to assign trainee to trainer.');
  }
}

/**
 * Removes a trainee from a trainer.
 *
 * @param {string} traineeId - The ID of the trainee to unassign.
 * @param {string} trainerId - The ID of the trainer from whom the trainee should be unassigned.
 * @returns {Promise<void>} Resolves if unassignment is successful.
 * @throws {Error} If unassignment fails.
 */
export async function unassignTraineeFromTrainer(traineeId: string, trainerId: string): Promise<void> {
  if (!traineeId || !trainerId) {
    throw new Error('Trainee ID and Trainer ID are required for unassignment.');
  }

  try {
    const result = await prisma.trainerTraineeMap.delete({
      where: {
        trainerId_traineeId: {
          trainerId: trainerId,
          traineeId: traineeId,
        },
      },
    });
    // You could check result to confirm deletion, e.g., if (result) { ... }
    console.log(`Assignment removed: Trainee ${traineeId} from Trainer ${trainerId}`);
  } catch (error: any) {
    // P2025 is Prisma's error code for "record to delete does not exist"
    if (error.code === 'P2025') {
      console.warn(`Attempted to unassign non-existent mapping: Trainee ${traineeId} from Trainer ${trainerId}`);
      throw new Error('Assignment not found or already removed.');
    }
    console.error('Error in unassignTraineeFromTrainer:', error);
    throw new Error(error.message || 'Failed to unassign trainee from trainer.');
  }
}
