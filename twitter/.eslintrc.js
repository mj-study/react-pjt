// .eslintrc.js 파일 생성
module.exports = {
  extends: [
    'react-app', // CRA 기본 설정 유지
    'react-app/jest',
    // 추가 설정
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // 커스텀 규칙 추가
    'no-console': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'off',
  },
};
