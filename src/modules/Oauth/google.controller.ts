import { Request, Response } from "express";
import userModelInstance from "../../utils/db/userdb/userdb.controller";
import GoogleService from "./google.service";
import logger from "../../utils/logging/logger";
import { createJWT } from "../../utils/jwt/jwt";

export default class GoogleOauthController {
  private static googleService = new GoogleService();

  // Handler for getting the authorization code
  static getAuthorizationCode = async (req: Request, res: Response) => {
    const authUrl = this.googleService.getAuthUrl();

    res.status(200).json({
      redirect_link: authUrl,
      success: true
    });
  }

  // Handler for handling the Google OAuth callback
  static googleOauthHandler = async (req: Request, res: Response) => {
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN as string;

    try {
      const code = req.query.code as string;

      if (!code) {
        return res.status(401).json({
          status: "fail",
          message: "Authorization code not provided!"
        });
      }
      await this.googleService.getToken(code);
      // Retrieve user information from Google based on the provided code
      const { verified_email, email, given_name, family_name, phoneNumber } =
        await this.googleService.getUser();

      if (!verified_email) {
        return res.status(403).json({
          status: "fail",
          message: "Google account not verified"
        });
      }

      // Find or create a user in the database based on the retrieved email
      const user = await userModelInstance.findOneAndUpdate(
        { email },
        {
          firstname: given_name,
          lastname: family_name,
          email,
          contact: phoneNumber
        },
        { upsert: true, new: true }
      );

      if (!user) return res.redirect(`${FRONTEND_ORIGIN}/oauth/error`);

      // Generate a JWT token for the authenticated user
      const token = createJWT(user);

      // Redirect to the frontend with the token in the URL
      res.redirect(`${FRONTEND_ORIGIN}/${token}`);

    } catch (err: any) {
      logger.error("Failed to authorize Google User", err);
      return res.redirect(`${FRONTEND_ORIGIN}/oauth/error`);
    }
  };
}
