/* ./setup/shiki.ts */
import { defineShikiSetup } from "@slidev/types";

export default defineShikiSetup(() => {
  return {
    themes: {
      dark: "dark-plus",
      light: "light-plus",
    },
    langs: ["js", "typescript", "zsh"],
    defaultColor: "light",
  };
});
