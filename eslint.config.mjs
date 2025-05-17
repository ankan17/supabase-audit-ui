import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import stylisticJs from '@stylistic/eslint-plugin-js';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Read .gitignore and convert to array of ignore patterns
function getGitignorePatterns() {
  const gitignorePath = new URL('./.gitignore', import.meta.url);
  const content = fs.readFileSync(gitignorePath, 'utf-8');
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.replace(/^\//, ''));
}

const gitignorePatterns = getGitignorePatterns();

const eslintConfig = [
  {
    ignores: gitignorePatterns,
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    plugins: {
      '@stylistic/js': stylisticJs,
      prettier: prettierPlugin,
    },
  },
  {
    rules: {
      semi: ['error', 'always'],
      'comma-dangle': ['off'],
      quotes: ['error', 'single'],
      'prettier/prettier': ['error'],
    },
  },
];

export default eslintConfig;
