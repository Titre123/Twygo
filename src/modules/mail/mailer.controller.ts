import nodemailer, {Transporter} from 'nodemailer';
import { Nodemailerservice, EmailMessage } from './mailer.interface';
import logger from '../../utils/logging/logger';


export default class NodemailerserviceImplement implements Nodemailerservice {
  private transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  async sendEmail(options: EmailMessage): Promise<String> {
    try{
      return await this.transporter.sendMail(options);
    } catch(e: any) {
      logger.error(e);
      throw new Error(e);
    }
  }
}