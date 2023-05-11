import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import { GoogleOauthToken,  GoogleUserResult } from './google.interface';

dotenv.config();

export default class GoogleService {
  public client_id: string;
  public redirect_url: string;
  public client_secret: string;
  public oauth2Client: any;

  constructor() {
    this.client_id = process.env.GOOGLE_OAUTH_CLIENT_ID || '';
    this.redirect_url = process.env.GOOGLE_OAUTH_REDIRECT || '';
    this.client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || '';

    if (!this.client_id || !this.client_secret || !this.redirect_url) {
      console.error('Google OAuth credentials not found or incomplete!');
    }

    this.oauth2Client = new google.auth.OAuth2(
      this.client_id,
      this.client_secret,
      this.redirect_url
    );
  }

  getAuthUrl = (): string => {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/user.phonenumbers.read'
    ];

    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });

    return authUrl;
  };

  getToken = async (code: string): Promise<GoogleOauthToken> => {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (err: any) {
      console.error('Failed to fetch Google OAuth tokens');
      throw new Error(err);
    }
  };

  getUser = async (): Promise<GoogleUserResult> => {
    const userInfo = google.oauth2('v2').userinfo;
    try {
      const res = await userInfo.get({ auth: this.oauth2Client });
      return res.data;
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  };
}