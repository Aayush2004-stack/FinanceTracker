export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {//message is from parent class i.e. Error
      super(message);//super sadhai this vhanda aagadi call garnu parxa 
      this.status=status;
  }
}


export function isPgUniqueVoilation(err: any):boolean{
    return err?.code==="23505";
}

export function isPgFKVoilation(err: any): boolean{
    return err?.code==="23503";
}