const formatCommand = 'prettier --write'
// const stylelintCommand = 'stylelint --allow-empty-input "src/*.{css,scss}"'

module.exports = {
  'src/*.{js,jsx,ts,tsx}': [formatCommand],
  // 'src/*.{css,scss}': [formatCommand, stylelintCommand],
  'src/!*.{js,jsx,ts,tsx,css,scss}': [formatCommand]
}
