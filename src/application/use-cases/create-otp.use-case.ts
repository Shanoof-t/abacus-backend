import { createOtpDto } from "../dtos/auth.dto";
import { ICreateOtpUseCase } from "../interfaces/auth.interfaces";

export default class CreateOtpUseCase implements ICreateOtpUseCase {
  execute(data: createOtpDto) {
    const otp = authHelper.generateOTP();
    const hashedOTP = await securityHelper.hashOTP({ otp });
    const otpInfo = await authHelper.createOneTimePassword({
      _id,
      hashedOTP,
      email,
    });

    if (process.env.NODE_ENV === "development") {
      const option = mailOption({ email, otp });
      const result = await transporter.sendMail(option);
      console.log("✅ Email sent:", result.response);
    } else {
      await sendOTPMail({ otp, toEmail: email, userName });
    }

    return otpInfo;
  }
}
