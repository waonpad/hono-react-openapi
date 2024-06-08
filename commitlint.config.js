import changelogConfig from "./changelog.config.js";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", changelogConfig.list],
  },
};
