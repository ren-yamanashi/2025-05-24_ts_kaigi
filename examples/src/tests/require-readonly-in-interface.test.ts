import { RuleTester } from "@typescript-eslint/rule-tester";
import { requireReadonlyInInterface } from "../require-readonly-in-interface";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("require-readonly-in-interface", requireReadonlyInInterface, {
  valid: [
    {
      code: `
      interface SampleInterface {
        readonly sampleProperty: string;
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      interface SampleInterface {
        sampleProperty: string;
      }
      `,
      errors: [{ messageId: "requireReadonlyInInterface" }],
    },
  ],
});
