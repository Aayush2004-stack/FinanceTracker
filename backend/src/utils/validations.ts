import IsEmail from "isemail";


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