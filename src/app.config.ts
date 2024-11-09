export default defineAppConfig({
  animation: true,
  entryPagePath: 'pages/blank/index',
  pages: ['pages/index/index', 'pages/blank/index', 'pages/home/index', 'pages/login/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
