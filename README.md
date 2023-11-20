# Custom language compiler written in Deno

The compiler will consist of three main parts:
- [x] The lexer 
- [ ] The AST
- [ ] The code generator (NASM 64 bit)

This compiler will only output the generated NASM 64 bit code. It will then use
the *NASM* compiler and the GNU linker *ld* to construct the binary.

# Some useful resources:

## https://astexplorer.net/

Here you can check your AST against popular AST implementations of many languages.
This can be very helpful to give an idea as to what the output should be, and help with
stealing some ideas you like form a particular language :)
