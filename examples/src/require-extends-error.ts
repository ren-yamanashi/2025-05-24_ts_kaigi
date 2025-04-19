import { ESLintUtils } from "@typescript-eslint/utils";
import { SymbolFlags, Type } from "typescript";

export const requireExtendsError = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description:
        "クラス名の末尾が 'Error' の場合は、Error クラスの継承を強制する",
    },
    messages: {
      requireExtendsError: "Error クラスを継承する必要があります",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      ClassDeclaration(node) {
        if (!node.id?.name.endsWith("Error")) return;

        const nodeType = parserServices.getTypeAtLocation(node);

        const isExtendedError = (type: Type): boolean => {
          if (type.symbol.flags === SymbolFlags.Class && type.symbol.name === "Error") {
            return true;
          }
          const baseTypes = type.getBaseTypes() ?? [];
          return baseTypes.some((baseType) => isExtendedError(baseType));
        };

        if (isExtendedError(nodeType)) return;

        context.report({
          node: node.id,
          messageId: "requireExtendsError",
        });
      },
    };
  },
});