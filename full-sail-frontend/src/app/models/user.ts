export class User {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    phoneNum?: number;
    profilePic?: string;

    constructor(email?: string, password?: string, firstName?: string, lastName?: string, address?: string, phoneNum?: number, profilePic?: string) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.phoneNum = phoneNum;
        this.profilePic = profilePic;
    }
}
