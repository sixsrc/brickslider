module.exports = { 
    extends: ['@commitlint/config-conventional'],
    rules: {
      'subject-min-length': [2, 'always', 3],
      'subject-empty': [2, 'never'],
    } 
  };
  