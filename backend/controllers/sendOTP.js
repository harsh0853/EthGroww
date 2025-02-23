import crypto from "crypto";
import { client } from "../config/redis.js";
import { transporter } from "../config/nodemailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateNumericOtp = (length = 6) => {
    return Array.from(crypto.randomBytes(length))
        .map(byte => byte % 10) 
        .join("");
};

const sendOTPEmail = asyncHandler(async (req, res)=> {
    const { email } = req.body;
    if(!email) throw new ApiError(400, "Email is required");

    const otp = generateNumericOtp(6);

    await client.set(`otp:${email}`, otp, "EX", 600);  // "EX" sets expiry to 10 mins
    const checkOTP = await client.get(`otp:${email}`);
    //console.log("Stored OTP in Redis:", checkOTP);

    if(!checkOTP) throw new ApiError(500, "failed to store OTP in Redis") 

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    const sendEmail = await transporter.sendMail(mailOptions);
    if(!sendEmail.accepted.length){
        throw new ApiError(500, "Failed to send OTP")
    }
    return res.status(200).json(
        new ApiResponse(200, "OTP send successfully")
    )

})

export {sendOTPEmail}



