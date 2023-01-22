export const sidebar = {
  '/guide/': [
    {
      text: '目錄',
      items: [
        // { text: '第 0 章 建構 SQL 執行環境', link: '/guide/chapter_0' },
        { text: '第 1 章 資料庫與SQL', link: '/guide/chapter_1' },
        { text: '第 2 章 查詢的基本語法', link: '/guide/chapter_2' },
        { text: '第 3 章 彙總與排序', link: '/guide/chapter_3' },
        { text: '第 4 章 更新資料', link: '/guide/chapter_4' },
        { text: '第 5 章 進階查詢功能', link: '/guide/chapter_5' },
        { text: '第 6 章 函數、述詞、CASE 運算式', link: '/guide/chapter_6' },
        { text: '第 7 章 集合運算 (合併查詢)', link: '/guide/chapter_7' },
        { text: '第 8 章 SQL 進階處理功能', link: '/guide/chapter_8' },
        { text: '第 9 章 從應用程式連接資料庫', link: '/guide/chapter_9' },
      ],
    },
  ]
}
// export const sidebar = [
//   // {
//   //   text: '第 0 章 建構 SQL 執行環境',
//   //   items: [
//   //     { text: 'Index', link: '/guide/chapter_0' },
//   //   ],
//   // },
//   {
//     text: '第 1 章 資料庫與SQL',
//     collapsible: true,
//     collapsed: true,
//     items: [
//       { text: 'Index', link: '/guide/chapter_1' },
//     ],
//   },
// ]
// export const sidebar = {
//   '/guide/': 'auto'
// }
// import {computed} from 'vue'
// export const showSidebar = computed(() => {
//   const { frontmatter } = route.data
//   const { themeConfig } = siteRouteData.value
//   return (
//     !frontmatter.home &&
//     frontmatter.sidebar !== false &&
//     ((typeof themeConfig.sidebar === 'object' &&
//       Object.keys(themeConfig.sidebar).length != 0) ||
//       (Array.isArray(themeConfig.sidebar) && themeConfig.sidebar.length != 0))
//   )
// })