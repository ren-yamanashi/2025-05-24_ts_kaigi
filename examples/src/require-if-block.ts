import { Rule } from "eslint";

export const requireIfBlock: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "if文を使用する場合は必ず Block Statement を使用する",
    },
    messages: {
      requireIfBlock: "if文を使用する場合は Block Statement を使用してください",
    },
    schema: [],
  },
  create(context) {
    return {};
  },
};
