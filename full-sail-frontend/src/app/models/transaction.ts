export class Transaction {
    amount?: string;
    income?: boolean;
    date?: Date;
    contributeToGoals?: boolean;
    description?: string;

    public constructor(amount?: string, date?: Date, contributeToGoals?: boolean, description?: string) {
        this.amount = amount;
        if (parseInt(this.amount) > 0) {
            this.income = true;
        } else {
            this.income = false;
        }
        this.date = date;
        this.contributeToGoals = contributeToGoals;
        this.description = description;
    }

}
