import antfu from '@antfu/eslint-config'

const baseConfig = {
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
    '**/components.d.ts/**',
  ],
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  formatters: true,
  typescript: true,
  vue: true,
  jsonc: false,
  yaml: false,
}

const ruleConfig = {
  rules: {
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: 'consecutive-duplicates-with-different-syntaxes',
      },
    ],
  },
}

export default antfu(baseConfig, ruleConfig)
