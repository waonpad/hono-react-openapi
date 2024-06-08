export default {
  disableEmoji: false,
  format: "{type}: {subject}",
  list: ["fix", "add", "update", "remove"],
  maxMessageLength: 72,
  minMessageLength: 1,
  questions: ["type", "subject"],
  types: {
    fix: {
      description: "バグ修正",
      value: "fix",
    },
    add: {
      description: "新機能",
      value: "add",
    },
    update: {
      description: "更新",
      value: "update",
    },
    remove: {
      description: "削除",
      value: "remove",
    },
  },
  messages: {
    type: "コミットする内容:",
    subject: "変更内容:\n",
  },
};
