export enum TokenType {
    Number,
    Identifier,
    Null,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Semicolon,
    Mutable,
    Immutable,
    EOF, // End of file token
}

const KEYWORDS: Record<string, TokenType> = {
    "mut": TokenType.Mutable,
    "immut": TokenType.Immutable,
    "moralmidget": TokenType.Null,
};

export enum BinOp {
    Addition = "+",
    Subtraction = "-",
    Division = "/",
    Modulus = "%",
    Multiplication = "*",
}

export interface Token {
    value?: string;
    type: TokenType;
}

const is_alpha = (str: string) => str.toUpperCase() !== str.toLowerCase();
const is_numeric = (str: string) => str.charCodeAt(0) <= '9'.charCodeAt(0) && str.charCodeAt(0) >= '0'.charCodeAt(0);
const is_skippable = (str: string) => [" ", "\n", "\t"].includes(str);

type MakeToken = (type: TokenType, value?: string) => Token;
const token: MakeToken = (type, value) => ({ type, value });

type Tokenize = (source_code: string) => Token[];
export const tokenize: Tokenize = (source_code) => {
    const tokens = new Array<Token>();
    const src = source_code.split(""); // every character gets represented separately!

    // build each token until end of file!
    while (src.length) {
        if (src[0] === '(') tokens.push(token(TokenType.OpenParen, src.shift()));
        else if (src[0] === ')') tokens.push(token(TokenType.CloseParen, src.shift()));
        else if (Object.values(BinOp).map(v => v.toString()).includes(src[0])) tokens.push(token(TokenType.BinaryOperator, src.shift()));
        else if (src[0] === '=') tokens.push(token(TokenType.Equals, src.shift()));
        else if (src[0] === ';') tokens.push(token(TokenType.Semicolon, src.shift()));
        else {
            // Handle multicharacter tokens
            if (is_numeric(src[0])) {
                let num = "";
                while (src.length && is_numeric(src[0])) num += src.shift();
                tokens.push(token(TokenType.Number, num));
            }
            else if (is_alpha(src[0])) {
                let identifier = "";
                while (src.length && (is_alpha(src[0]) || is_numeric(src[0]))) identifier += src.shift();
                // Check if it's a reserved word
                // if (Object.keys(KEYWORDS).includes(identifier)) tokens.push(token(KEYWORDS[identifier], identifier));
                // else tokens.push(token(TokenType.Identifier, identifier));
                tokens.push(token(KEYWORDS[identifier] || TokenType.Identifier, identifier));
            } else if (is_skippable(src[0])) src.shift();
            else {
                console.log(`Unrecognized character found in src: ${src[0]}`);
                Deno.exit(1);
            };
        };
    };

    tokens.push(token(TokenType.EOF));

    return tokens;
};

// MAIN FUNCTION
(async function() {
    if (Deno.args.length < 1) {
        console.log(`Entered REPL mode.`);
        return;
    };

    const source_code = await Deno.readTextFile(`./${Deno.args[0]}`);

    console.log(tokenize(source_code));
})();
