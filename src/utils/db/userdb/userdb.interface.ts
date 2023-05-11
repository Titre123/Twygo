import { Document, Schema } from 'mongoose';

export interface UserDbInterface extends Document {
  _id?: string;
  firstName: string,
  lastName: string,
  email: string;
  phoneNumber: string;
  password: string;
  [key: string]: any;
}
