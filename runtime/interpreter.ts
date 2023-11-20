import { RuntimeVal, NumberVal, NullVal } from "./values.ts";
import { Stmt, NumericLiteral, BinaryExpr, Program } from "../compiler/ast.ts";

const op_strategy = {
    "+": (lhs: NumberVal, rhs: NumberVal) => lhs.value + rhs.value,
    "-": (lhs: NumberVal, rhs: NumberVal) => lhs.value - rhs.value,
    "/": (lhs: NumberVal, rhs: NumberVal) => lhs.value / rhs.value,
    "*": (lhs: NumberVal, rhs: NumberVal) => lhs.value * rhs.value,
    "%": (lhs: NumberVal, rhs: NumberVal) => lhs.value % rhs.value,
};

type EvalProgram = (program: Program) => RuntimeVal;
const eval_program: EvalProgram = (program) => {
    let last_evaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;

    for (const statement of program.body) {
        last_evaluated = evaluate(statement);
    };

    return last_evaluated;
};

type EvalNumBinExpr = (lhs: NumberVal, rhs: NumberVal, op: string) => NumberVal;
const eval_numeric_binary_expr: EvalNumBinExpr = (lhs, rhs, op) =>
    ({ type: "number", value: op_strategy[op as keyof typeof op_strategy](lhs, rhs) } as NumberVal);

type EvalBinOp = (binop: BinaryExpr) => RuntimeVal;
const eval_binary_expr: EvalBinOp = (binop) => {
    const [lhs, rhs] = [evaluate(binop.left), evaluate(binop.right)];

    if (lhs.type === "number" && rhs.type === "number")
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.op);
    
    return { value: "null", type: "null" } as NullVal;
};

type Evaluate = (ast_node: Stmt) => RuntimeVal;
export const evaluate: Evaluate = (ast_node) => {
    switch (ast_node.kind) {
        case "NumericLiteral":
            return { type: "number", value: (ast_node as NumericLiteral).value } as NumberVal;

        case "NullLiteral":
            return { type: "null", value: "null" } as NullVal;

        case "BinaryExpr":
            return eval_binary_expr(ast_node as BinaryExpr);

        case "Program":
            return eval_program(ast_node as Program);
        
        default:
            console.error(`This AST node was not set up for interpretation`);
            console.dir(ast_node, { depth: null });
            Deno.exit(1);
    };
};
