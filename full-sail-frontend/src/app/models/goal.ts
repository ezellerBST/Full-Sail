export class Goal {
    name?: string;
    total?: number;
    amountPerPaycheck ?: number;
    balance?: number;
    dateCreated?: Date;

    constructor( name?: string, total?: number, amountPerPaycheck ?: number, balance ?: number, dateCreated ?: Date ) {
        this.dateCreated = new Date();
        this.name = name;
        this.total = total;
        this.amountPerPaycheck = amountPerPaycheck;
        this.balance = balance;
        this.dateCreated = dateCreated;
    }
}
