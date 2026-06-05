export type transaction_type="credit"|"debit";

export interface transaction{
    id:string;
    user_id:string;
    category_id:string;
    area_id:string;
    title:string;
    remarks:string;
    amount: number;
    type:transaction_type;
    txn_date:string;
    created_at:string;
    updated_at:string;
}

