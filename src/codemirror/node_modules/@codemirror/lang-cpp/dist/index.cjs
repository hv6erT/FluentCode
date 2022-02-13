'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cpp$1 = require('@lezer/cpp');
var language = require('@codemirror/language');
var highlight = require('@codemirror/highlight');

/**
A language provider based on the [Lezer C++
parser](https://github.com/lezer-parser/cpp), extended with
highlighting and indentation information.
*/
const cppLanguage = language.LRLanguage.define({
    parser: cpp$1.parser.configure({
        props: [
            language.indentNodeProp.add({
                IfStatement: language.continuedIndent({ except: /^\s*({|else\b)/ }),
                TryStatement: language.continuedIndent({ except: /^\s*({|catch)\b/ }),
                LabeledStatement: language.flatIndent,
                CaseStatement: context => context.baseIndent + context.unit,
                BlockComment: () => -1,
                Statement: language.continuedIndent({ except: /^{/ })
            }),
            language.foldNodeProp.add({
                "DeclarationList CompoundStatement EnumeratorList FieldDeclarationList InitializerList": language.foldInside,
                BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 }; }
            }),
            highlight.styleTags({
                "typedef struct union enum class typename decltype auto template operator friend noexcept namespace using __attribute__ __declspec __based": highlight.tags.definitionKeyword,
                "extern MsCallModifier MsPointerModifier extern static register inline const volatile restrict _Atomic mutable constexpr virtual explicit VirtualSpecifier Access": highlight.tags.modifier,
                "if else switch for while do case default return break continue goto throw try catch": highlight.tags.controlKeyword,
                "new sizeof delete static_assert": highlight.tags.operatorKeyword,
                "NULL nullptr": highlight.tags.null,
                this: highlight.tags.self,
                "True False": highlight.tags.bool,
                "TypeSize PrimitiveType": highlight.tags.standard(highlight.tags.typeName),
                TypeIdentifier: highlight.tags.typeName,
                FieldIdentifier: highlight.tags.propertyName,
                "CallExpression/FieldExpression/FieldIdentifier": highlight.tags.function(highlight.tags.propertyName),
                StatementIdentifier: highlight.tags.labelName,
                Identifier: highlight.tags.variableName,
                "CallExpression/Identifier": highlight.tags.function(highlight.tags.variableName),
                "CallExpression/ScopedIdentifier/Identifier": highlight.tags.function(highlight.tags.variableName),
                DestructorName: highlight.tags.name,
                NamespaceIdentifier: highlight.tags.namespace,
                OperatorName: highlight.tags.operator,
                ArithOp: highlight.tags.arithmeticOperator,
                LogicOp: highlight.tags.logicOperator,
                BitOp: highlight.tags.bitwiseOperator,
                CompareOp: highlight.tags.compareOperator,
                AssignOp: highlight.tags.definitionOperator,
                UpdateOp: highlight.tags.updateOperator,
                LineComment: highlight.tags.lineComment,
                BlockComment: highlight.tags.blockComment,
                Number: highlight.tags.number,
                String: highlight.tags.string,
                "RawString SystemLibString": highlight.tags.special(highlight.tags.string),
                CharLiteral: highlight.tags.character,
                EscapeSequence: highlight.tags.escape,
                PreProcArg: highlight.tags.meta,
                "PreprocDirectiveName #include #ifdef #ifndef #if #define #else #endif #elif": highlight.tags.processingInstruction,
                MacroName: highlight.tags.special(highlight.tags.name),
                "( )": highlight.tags.paren,
                "[ ]": highlight.tags.squareBracket,
                "{ }": highlight.tags.brace,
                "< >": highlight.tags.angleBracket,
                ". ->": highlight.tags.derefOperator,
                ", ;": highlight.tags.separator
            })
        ]
    }),
    languageData: {
        commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
        indentOnInput: /^\s*(?:case |default:|\{|\})$/
    }
});
/**
Language support for C++.
*/
function cpp() {
    return new language.LanguageSupport(cppLanguage);
}

exports.cpp = cpp;
exports.cppLanguage = cppLanguage;
