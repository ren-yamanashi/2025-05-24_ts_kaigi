import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";
import { Type } from "typescript";

export const pascalCaseConstructId = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    docs: {
      description: "Construct の id は PascalCase である必要があります",
    },
    messages: {
      pascalCaseConstructId:
        "Construct の id は PascalCase である必要があります",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    return {
      NewExpression(node) {
        const nodeType = parserServices.getTypeAtLocation(node);

        const isExtendedConstruct = (type?: Type): boolean => {
          const baseTypes = type?.getBaseTypes() ?? [];
          if (type?.symbol?.name === "Construct") {
            return true;
          }
          return baseTypes.some((baseType) => isExtendedConstruct(baseType));
        };

        if (!isExtendedConstruct(nodeType)) return;

        const constructId = node.arguments[1];
        if (
          !constructId ||
          constructId.type !== AST_NODE_TYPES.Literal ||
          typeof constructId.value !== "string"
        ) {
          return;
        }

        if (!/^[A-Z][a-zA-Z0-9]*$/.test(constructId.value)) {
          context.report({
            node: constructId,
            messageId: "pascalCaseConstructId",
          });
        }
      },
    };
  },
});
