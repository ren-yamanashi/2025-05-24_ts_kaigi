import { Rule } from "eslint";

export const noImportPrivate: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that a variable named `foo` can only be assigned a value of 'bar'.",
    },
    fixable: "code",
    schema: [],
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        if (
          node.parent.type !== "VariableDeclaration" ||
          node.parent.kind !== "const"
        ) {
          return;
        }
        // 変数名がfooでない場合はスキップ
        if (node.id.type !== "Identifier" || node.id.name !== "foo") {
          return;
        }
        // 値がLiteralでない場合はスキップ
        if (!node.init || node.init.type !== "Literal") {
          return;
        }
        // 値がbarでない場合はエラーを報告
        if (node.init.value !== "bar") {
          context.report({
            node,
            message:
              'Value other than "bar" assigned to `const foo`. Unexpected value: {{ notBar }}.',
            fix(fixer) {
              return fixer.replaceText(node.init, '"bar"');
            },
          });
        }
      },
    };
  },
};
