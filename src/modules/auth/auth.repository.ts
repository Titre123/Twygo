import sha1 from 'sha1';
import { User, userPayload } from './auth.interface';
import { ConflictError } from "../../commons/error";
import userModelInstance from '../../utils/db/userdb/userdb.controller';

export default class AuthRepository {
  private user: any;

  constructor() {
    this.user = userModelInstance;
  }
  

  public addUser(userPayload: User): any {
    const {firstName, lastName, email, phoneNumber, password} = userPayload;
    let user = this.user.findOne({email});

    if (user) throw new ConflictError();

    let newUser = this.user.create({firstName, lastName, phoneNumber, email, password: sha1(password)});
    return newUser
  }

}
