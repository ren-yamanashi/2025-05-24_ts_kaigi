import { RuleTester } from "eslint";
import { requireIfBlock } from "../require-if-block";

const ruleTester = new RuleTester();

ruleTester.run("require-if-block", requireIfBlock, {
  valid: [
    {
      code: `
      if (true) {
        console.log("true");
      }`,
    },
  ],
  invalid: [
    {
      code: `if (true) console.log("true");`,
      errors: [{ messageId: "requireIfBlock" }],
    },
  ],
});
