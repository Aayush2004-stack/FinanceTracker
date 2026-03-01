import IsEmail from "isemail";


export function isValidEmail(email:string):boolean{
    return IsEmail.validate(email);
}