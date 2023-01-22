
import { defineConfig } from "vitepress";
import { head, nav, sidebar } from './configs'

export default defineConfig({
  // base: '/base/',   // 站點將部署在這個 base URL路徑
  title: '從零開始 邁向數據分析 SQL 資料庫語法入門',
  description: '閱讀筆記',
  themeConfig: {
    logo: '/apple-touch-icon.png',
    siteTitle: '從零開始 邁向數據分析 SQL 資料庫語法入門',
    
    head,
    nav,
    sidebar,

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/gumingWu/vitepress-fun' }
    // ],
    markdown: {
      lineNumbers: true,    // 行號
    },
    footer: {
      copyright: 'MIT Lincensed | Copyright © 2023-present Eason',
    }
  },
  vite: {
    server: {
      port: 8500
    }
  }
})