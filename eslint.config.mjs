import antfu from '@antfu/eslint-config'

import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default antfu(
  {
    ignores: [
      '*.sh',
      '**/*.sh/**',
      'node_modules',
      '**/node_modules/**',
      '*.md',
      '**/*.md/**',
      '*.woff',
      '**/*.woff/**',
      '*.ttf',
      '**/*.ttf/**',
      '.vscode',
      '**/.vscode/**',
      '.idea',
      '**/.idea/**',
      'dist',
      '**/dist/**',
      'public',
      'public/**',
      'docs',
      'docs/**',
      '.husky',
      '**/.husky/**',
      '.local',
      '**/.local/**',
      'bin',
      'bin/**',
      'src-tauri',
      '**/src-tauri/**',
      'src/index.html',
      'src/index.html/**',
      'babel.config.js',
      '**/babel.config.js/**',
      'components.d.ts',
      '**/components.d.ts/**'
    ],
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false,
      overrides: {
        'style/comma-dangle': ['error', 'never']
      }
    },
    formatters: true,
    vue: true,
    jsonc: false,
    yaml: false,
    typescript: {
      tsconfigPath: 'tsconfig.json'
    }
  },
  ...compat.config({
    rules: {
      'style/semi': ['error', 'never'],
      'no-console': 'off',
      'comma-dangle': ['error', 'never'],
      'node/prefer-global/process': ['error', 'never'],
      '@typescript-eslint/strict-boolean-expressions': ['error', 'never'],
    }
  })
)
