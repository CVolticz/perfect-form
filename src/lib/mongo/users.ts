import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongo/client';

let client;
let db: any;
let users: { findOne: (arg0: { _id?: any; email?: any; }) => any; updateOne: (arg0: { email: any; }, arg1: { $set: any; }) => any; };

async function init() {
  if (db) return
  try {
    client = await clientPromise
    db = await client.db()
    users = await db.collection('users')
  } catch (error) {
    throw new Error('Failed to stablish connection to database')
  }
}

/////////////
/// USERS ///
/////////////
export async function findUserById(userId: string) {
  try {
    if (!users) await init()

    const user = await users.findOne({ _id: new ObjectId(userId) })

    if (!user) throw new Error()

    return { user: { ...user, _id: user._id.toString() } }
  } catch (error) {
    return { error: 'Failed to find the user.' }
  }
}

export async function findUserByEmail(email: string) {
  try {
    if (!users) await init()

    const user = await users.findOne({ email })

    if (!user) throw new Error()

    return { user: { ...user, _id: user._id.toString() } }
  } catch (error) {
    return { error: 'Failed to find the user.' }
  }
}

export async function updateUser(email: string, update: { name: string; }) {
  try {
    if (!users) await init()

    await users.updateOne({ email }, { $set: update })

    return { success: true }
  } catch (error) {
    return { error: 'Failed to reset the password.' }
  }
}