export class Transaction {
    amount?: number;
    income?: boolean;
    date?: Date;
    contributeToGoals?: boolean;
    description?: string;

    public constructor(
        amount?: number, 
        date?: Date, 
        contributeToGoals?: boolean, 
        description?: string
        ) {
            
        this.amount = amount;
        if (this.amount > 0) {
            this.income = true;
        } else {
            this.income = false;
        }
        this.date = date;
        this.contributeToGoals = contributeToGoals;
        this.description = description;
    }

}
