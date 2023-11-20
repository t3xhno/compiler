import Parser from "./compiler/parser.ts";

const repl = () => {
    const parser = new Parser();
    console.log(`\nMidget REPL v1.0 | 20.11.2023.\n`);
    while (true) {
        const input = prompt(">>> ");

        if (!input || input.includes("exit")) Deno.exit(1);

        const program = parser.produceAST(input);
        console.dir(program, { depth: null });
    };
};

repl();
