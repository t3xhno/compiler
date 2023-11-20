import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier } from "./ast.ts";
import { tokenize } from "./lexer.ts";
import { Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type !== TokenType.EOF;
    };

    private at() {
        return this.tokens[0];
    };

    private eat(): Token | undefined {
        // const prev = this.tokens.shift();
        // return prev;
        return this.tokens.shift();
    };

    public produceAST(source_code: string): Program {
        this.tokens = tokenize(source_code);
        const program: Program = {
            kind: "Program",
            body: [],
        };

        // Parse until the EOF token
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        };

        return program;
    };

    private parse_stmt(): Stmt {
        // For now we have no statements, except the program. Do expressions first
        return this.parse_expr();
    };

    private parse_expr(): Expr {
        return this.parse_primary_expr();
    };

    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch (tk) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat()?.value } as Identifier;

            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat()?.value!) } as NumericLiteral;

            default:
                console.log(`Unexpected token found during parsing:`);
                console.dir(this.at(), { depth: null });
                Deno.exit(1);
        };
    };
};
