import { RuleTester } from "@typescript-eslint/rule-tester";
import { requireExtendsError } from "../require-extends-error";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("require-extends-error", requireExtendsError, {
  valid: [
    {
      code: `
      declare class Error {}
      export class SampleError extends Error {}
      `,
    },
    {
      code: `
      declare class Error {}
      declare class BaseError extends Error {}
      export class SampleError extends BaseError {}
      `,
    },
  ],
  invalid: [
    {
      code: "export class SampleError {}",
      errors: [{ messageId: "requireExtendsError" }],
    },
    {
      code: `
      declare class BaseClass {}
      export class SampleError extends BaseClass {}
      `,
      errors: [{ messageId: "requireExtendsError" }],
    },
  ],
});
