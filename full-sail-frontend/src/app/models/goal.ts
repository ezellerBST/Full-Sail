export class Goal {
    name?: string;
    total?: number;
    amountContributed ?: number;
    balance?: number;
    dateCreated?: Date;

    constructor( name?: string, total?: number, amountContributed ?: number, balance ?: number, dateCreated ?: Date ) {
        this.name = name;
        this.total = total;
        this.amountContributed = amountContributed;
        this.balance = balance;
        this.dateCreated = dateCreated;
    }
}
