// ================
// TYPE DEFINITIONS
// ================

interface Command<T extends Function> {
    name: string;
    description: string;
    args: Argument[];
    options: Option[];
    run: T;
}

interface Argument {
    name: string;
    description: string;
    default: any;
}

interface Option {
    name: string;
    description: string;
    default: any;
}
