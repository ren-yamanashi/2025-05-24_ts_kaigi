import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils";

export const requireReadonlyInInterface = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "problem",
    messages: {
      requireReadonlyInInterface: "readonly を使用してください",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      TSInterfaceDeclaration(node) {
        for (const property of node.body.body) {
          if (
            property.type !== AST_NODE_TYPES.TSPropertySignature ||
            property.key.type !== AST_NODE_TYPES.Identifier
          ) {
            continue;
          }

          if (property.readonly) continue;

          context.report({
            node: property,
            messageId: "requireReadonlyInInterface",
            data: {
              propertyName: property.key.name,
            },
          });
        }
      },
    };
  },
});
