import { tokenize, Token, TokenType, BinOp } from "./lexer.ts";
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier } from "./ast.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type !== TokenType.EOF;
    };

    private at() {
        return this.tokens[0];
    };

    private eat(): Token {
        // const prev = this.tokens.shift();
        // return prev;
        return this.tokens.shift()!;
    };

    private expect(type: TokenType, err: string) {
        const prev = this.tokens.shift();
        if (!prev || prev.type !== type) {
            console.error(`Parser error: ${err}`);
            console.dir(prev, { depth: null });
            console.log(`\nExpected: ${type}`);
            Deno.exit(1);
        };
        return prev;
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
        return this.parse_additive_expr();
        // return this.parse_primary_expr();
    };

    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr();

        // (10 + (10 - fooBar())) - 5
        while ([BinOp.Addition, BinOp.Subtraction].includes((this.at().value || "") as BinOp)) {
            const op = this.eat()?.value;
            const right = this.parse_multiplicative_expr();
            left = { kind: "BinaryExpr", left, right, op, } as BinaryExpr;
        };
        return left;
    };

    private parse_multiplicative_expr(): Expr {
        let left = this.parse_primary_expr();

        // (10 + (10 - fooBar())) - 5
        while ([BinOp.Division, BinOp.Multiplication, BinOp.Modulus].includes((this.at().value || "") as BinOp)) {
            const op = this.eat()?.value;
            const right = this.parse_primary_expr();
            left = { kind: "BinaryExpr", left, right, op, } as BinaryExpr;
        };
        return left;
    };

    /**
     *  Orders of precedence:
     * 
     *  AssignmentExpr
     *  MemberExpr
     *  FunctionCalls
     *  LogicalExpr
     *  ComparisonExpr
     *  AdditiveExpr
     *  MultiplicativeExpr
     *  UnaryExpr
     *  PrimaryExpr
     */

    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch (tk) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;

            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value!) } as NumericLiteral;

            case TokenType.OpenParen: {
                this.eat();
                const value = this.parse_expr();
                this.expect(TokenType.CloseParen, "Unexpected token. Expected closing parentheses");
                return value;
            };

            default:
                console.log(`Unexpected token found during parsing:`);
                console.dir(this.at(), { depth: null });
                Deno.exit(1);
        };
    };
};
