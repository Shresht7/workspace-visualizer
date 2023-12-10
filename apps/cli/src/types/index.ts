// ================
// TYPE DEFINITIONS
// ================

/** The type of a command. */
interface Command<T extends (...args: any[]) => void> {
    name: string;
    description: string;
    aliases: string[];
    args: Argument[];
    options: Option[];
    run: T;
}

/** The type of an argument. */
interface Argument<T = any> {
    name: string;
    description: string;
    default: T;
}

/** The type of an option. */
interface Option<T = any> {
    name: string;
    description: string;
    default?: T,
    required?: boolean;
}
