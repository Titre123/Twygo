import { Schema, Model } from 'mongoose';
import {UserDbInterface} from './userdb.interface';
import DB from '../db_manager';
import * as dotenv from 'dotenv';

dotenv.config();

// This function creates a new Mongoose model for the "Product" collection, based on the ProductInterface schema
async function userModel() {
  // Connect to the database using the URI string from the environment variables
  const db = new DB(`${process.env.URI_STRING}`);
  await db.connect()

  // Define the schema for the "User" collection
  const UserSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
  });

  // Create a new Mongoose model for the "User" collection, based on the UserInterface schema
  const User: Model<UserDbInterface> = db.connection().model<UserDbInterface>('User', UserSchema);
  return User
}

export default userModel;
