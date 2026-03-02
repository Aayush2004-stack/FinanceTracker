import crypto from "crypto";

export function generateOTP(length=6):string{
    const digits="0123456789";
    let otp="";
    const bytes= crypto.randomBytes(length);

    for(let i =0; i<length; i++){
        otp+=(digits[bytes[i]%10])
    }

    return otp;
}

export function hashOTP(otp:string):string{
    const hashedOtp= crypto.createHash("sha256").update(otp).digest("hex");
    return hashedOtp;
}

export function setOtpExpiryTime(minutes=10):Date{
    return new Date(Date.now()+minutes*60*1000);//date.now gives time in ms (changing minute to ms )
}
