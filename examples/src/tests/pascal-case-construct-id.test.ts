import { RuleTester } from "@typescript-eslint/rule-tester";
import { pascalCaseConstructId } from "../pascal-case-construct-id";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.ts*"],
      },
    },
  },
});

ruleTester.run("pascal-case-construct-id", pascalCaseConstructId, {
  valid: [
    // WHEN: id is empty
    {
      code: `
      export declare class Construct {
        constructor(scope: Construct, id: string);
      }
      export declare class MyConstruct extends Construct {
        constructor(scope: Construct, id: string);
      }
      const myConstruct = new MyConstruct(new Construct(), 'MyConstruct');
      `,
    },
  ],
  invalid: [
    // WHEN: id is snake_case(double quote)
    {
      code: `
      export declare class Construct {
        constructor(scope: Construct, id: string);
      }
      export declare class MyConstruct extends Construct {
        constructor(scope: Construct, id: string);
      }
      const myConstruct = new MyConstruct(new Construct(), 'myConstruct');
      `,
      errors: [{ messageId: "pascalCaseConstructId" }],
    },
  ],
});
