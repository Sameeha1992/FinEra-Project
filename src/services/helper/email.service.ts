import nodemailer from 'nodemailer'
import { IEmailService } from "../../interfaces/helper/email.sevice.interface";
import dotenv from 'dotenv'
import { injectable } from 'tsyringe';

dotenv.config()
@injectable()
export class EmailService implements IEmailService{
    private transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })

    async sendEmail(toEmail: string, subject: string, content: string): Promise<void> {
      console.log("Attempts to send email to:",toEmail)  
      const mailOptions ={
            from: process.env.EMAIL_USER,
            to:toEmail,
            subject,
            html:content
        };
        try {
          console.log("mailoptions",mailOptions)
            const info = await this.transporter.sendMail(mailOptions)
            console.log("Email sent successfully",info.response)
          
        } catch (error:any) {
          console.error("❌ Failed to send email:", error.message || error);

        throw new Error("Failed to send OTP email. Please try again.");
        }
    }


    generateOtpEmailContent(otp: number): string {
       
        return  `<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Arial', sans-serif; color: #1e293b;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellspacing="0" cellpadding="0" style="background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          <!-- Logo/Header -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <div style="font-size: 28px; font-weight: bold; color: #2563eb; letter-spacing: -0.5px;">
                FinEra
              </div>
              <div style="font-size: 14px; color: #64748b; margin-top: 5px;">
                Modern Financial Solutions
              </div>
            </td>
          </tr>
          
          <!-- Title -->
          <tr>
            <td align="center" style="font-size: 24px; font-weight: bold; padding-bottom: 15px; color: #1e293b;">
              Verify Your Email
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td align="center" style="font-size: 16px; line-height: 1.6; padding-bottom: 30px; color: #475569;">
              Welcome to <strong style="color: #2563eb;">FinEra</strong>! To complete your registration, use the OTP below:
            </td>
          </tr>
          
          <!-- OTP Code -->
          <tr>
            <td align="center">
              <div style="display: inline-block; padding: 18px 35px; font-size: 32px; font-weight: bold; 
                          color: #ffffff; background: linear-gradient(135deg, #2563eb, #3b82f6); 
                          border-radius: 10px; letter-spacing: 4px; box-shadow: 0px 4px 15px rgba(37, 99, 235, 0.3);">
                ${otp}
              </div>
            </td>
          </tr>

          <!-- Expiration & Warning -->
          <tr>
            <td align="center" style="font-size: 14px; padding-top: 25px; color: #475569; line-height: 1.5;">
              This OTP is valid for <strong style="color: #2563eb;">10 minutes</strong>. <br>
              Please do not share it with anyone.
            </td>
          </tr>
          
          <!-- Support -->
          <tr>
            <td align="center" style="font-size: 14px; padding-top: 30px; color: #64748b; border-top: 1px solid #e2e8f0; margin-top: 25px; padding-top: 25px;">
              If you did not request this, please ignore this email. <br>
              For assistance, contact 
              <a href="mailto:support@finera.com" style="color: #2563eb; text-decoration: none; font-weight: 500; border-bottom: 1px solid #2563eb;">
                support@finera.com
              </a>.
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 20px; font-size: 12px; color: #94a3b8;">
              © 2024 FinEra. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    }
}