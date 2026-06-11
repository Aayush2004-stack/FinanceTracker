import IsEmail from "isemail";
import { StringDecoder } from "node:string_decoder";


export function isValidEmail(email:string):boolean{
    return IsEmail.validate(email);
}

export  function isValidPassword(password:string):boolean{
    if(password.length<8){
        return false;

    }
    const hasUpperCase =/[A-Z]/.test(password);
    const hasLowerCase =/[a-z]/.test(password);
    const hasNumber=/[0-9]/.test(password);
    return (hasLowerCase && hasUpperCase && hasNumber);
}


export function formatUserName(name:string):string{
    const formatedName =name.trim().replace(/\s+/g," ").toUpperCase();//remove white spaces
    return formatedName ;
}

export function formatEmail(email:string):string{
    const formatedEmail = email.trim().toLowerCase();
    return formatedEmail;
}
export function isValidName(name:string):boolean{
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}
