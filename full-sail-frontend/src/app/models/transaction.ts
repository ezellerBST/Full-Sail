export class Transaction {
    amount?: string;
    income?: boolean;
    date?: Date;
    contributeToGoals?: boolean;
    description?: string;

    constructor(amount?: string, income?: boolean, date?: Date, contributeToGoals?: boolean, description?: string) {
        this.amount = amount;
        this.income = income;
        this.date = date;
        this.contributeToGoals = contributeToGoals;
        this.description = description;
    }

}
