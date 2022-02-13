import { parser } from '@lezer/cpp';
import { LRLanguage, indentNodeProp, continuedIndent, flatIndent, foldNodeProp, foldInside, LanguageSupport } from '@codemirror/language';
import { styleTags, tags } from '@codemirror/highlight';

/**
A language provider based on the [Lezer C++
parser](https://github.com/lezer-parser/cpp), extended with
highlighting and indentation information.
*/
const cppLanguage = /*@__PURE__*/LRLanguage.define({
    parser: /*@__PURE__*/parser.configure({
        props: [
            /*@__PURE__*/indentNodeProp.add({
                IfStatement: /*@__PURE__*/continuedIndent({ except: /^\s*({|else\b)/ }),
                TryStatement: /*@__PURE__*/continuedIndent({ except: /^\s*({|catch)\b/ }),
                LabeledStatement: flatIndent,
                CaseStatement: context => context.baseIndent + context.unit,
                BlockComment: () => -1,
                Statement: /*@__PURE__*/continuedIndent({ except: /^{/ })
            }),
            /*@__PURE__*/foldNodeProp.add({
                "DeclarationList CompoundStatement EnumeratorList FieldDeclarationList InitializerList": foldInside,
                BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 }; }
            }),
            /*@__PURE__*/styleTags({
                "typedef struct union enum class typename decltype auto template operator friend noexcept namespace using __attribute__ __declspec __based": tags.definitionKeyword,
                "extern MsCallModifier MsPointerModifier extern static register inline const volatile restrict _Atomic mutable constexpr virtual explicit VirtualSpecifier Access": tags.modifier,
                "if else switch for while do case default return break continue goto throw try catch": tags.controlKeyword,
                "new sizeof delete static_assert": tags.operatorKeyword,
                "NULL nullptr": tags.null,
                this: tags.self,
                "True False": tags.bool,
                "TypeSize PrimitiveType": /*@__PURE__*/tags.standard(tags.typeName),
                TypeIdentifier: tags.typeName,
                FieldIdentifier: tags.propertyName,
                "CallExpression/FieldExpression/FieldIdentifier": /*@__PURE__*/tags.function(tags.propertyName),
                StatementIdentifier: tags.labelName,
                Identifier: tags.variableName,
                "CallExpression/Identifier": /*@__PURE__*/tags.function(tags.variableName),
                "CallExpression/ScopedIdentifier/Identifier": /*@__PURE__*/tags.function(tags.variableName),
                DestructorName: tags.name,
                NamespaceIdentifier: tags.namespace,
                OperatorName: tags.operator,
                ArithOp: tags.arithmeticOperator,
                LogicOp: tags.logicOperator,
                BitOp: tags.bitwiseOperator,
                CompareOp: tags.compareOperator,
                AssignOp: tags.definitionOperator,
                UpdateOp: tags.updateOperator,
                LineComment: tags.lineComment,
                BlockComment: tags.blockComment,
                Number: tags.number,
                String: tags.string,
                "RawString SystemLibString": /*@__PURE__*/tags.special(tags.string),
                CharLiteral: tags.character,
                EscapeSequence: tags.escape,
                PreProcArg: tags.meta,
                "PreprocDirectiveName #include #ifdef #ifndef #if #define #else #endif #elif": tags.processingInstruction,
                MacroName: /*@__PURE__*/tags.special(tags.name),
                "( )": tags.paren,
                "[ ]": tags.squareBracket,
                "{ }": tags.brace,
                "< >": tags.angleBracket,
                ". ->": tags.derefOperator,
                ", ;": tags.separator
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
    return new LanguageSupport(cppLanguage);
}

export { cpp, cppLanguage };
