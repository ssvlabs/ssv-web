export default class Arguments {
    private arguments = {};
    private argv;

    constructor() {
        this.argv = require('minimist')(process.argv.slice(2));
    }
    verifyArguments() {
        console.log(this.argv);
    }
}

export class Argumenets {
}