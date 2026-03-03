import bcrypt from "bcrypt";

export async function hashPassword(password: string){
    return bcrypt.hash(password,10);
}


export async function verifyPassword(password:string, hashedPassword: string){
    return bcrypt.compare(password,hashedPassword);

}
// export  function validatePassword(password:string):boolean{
//     if(password.length<8){
//         return false;

//     }
//     const hasUpperCase =/[A-Z]/.test(password);
//     const hasLowerCase =/[a-z]/.test(password);
//     const hasNumber=/[0-9]/.test(password);
//     return (hasLowerCase && hasUpperCase && hasNumber);
// }