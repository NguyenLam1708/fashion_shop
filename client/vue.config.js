const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000 // ← đổi sang cổng bạn muốn, ví dụ 4000
  }
})
