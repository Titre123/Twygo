import userModel from "./userdb.model";

class UserDbController {
  private user: any;

  constructor() {
    (async () => {
      this.user = await userModel();
      // You can now use the assigned user value
      console.log(this.user);
    })();
  }

  public getUserModel() {
    return this.user;
  }
}

const userDbController = new UserDbController();
const userModelInstance = userDbController.getUserModel();

export default userModelInstance;
