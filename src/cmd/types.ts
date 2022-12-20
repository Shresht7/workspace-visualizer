interface Command {
    name: string;
    description: string;
    args: Argument[];
    options: Option[];
    run: (...args: any[]) => void;
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
