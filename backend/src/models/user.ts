
export interface user{
    id: string;
    name: string;
    email:string;
    password: string;
    created_at:string;
    updated_at:string;
    is_verified:boolean;
    otp:string;
    otp_expiry_time: Date;


}