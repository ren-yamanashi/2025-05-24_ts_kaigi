import { Rule } from "eslint";

export const requireIfBlock: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "if文を Block Statement で記述することを強制する",
    },
    messages: {
      requireIfBlock: "if文にブロックを使用してください",
    },
  },
  create(context) {
    return {
      IfStatement(node) {
        if (node.consequent.type !== "BlockStatement") {
          context.report({
            node,
            messageId: "requireIfBlock",
          });
        }
      },
    };
  },
};
