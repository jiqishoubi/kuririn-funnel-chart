import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

const _external = Object.keys({
  ...((pkg as any).devDependencies || {}),
  ...((pkg as any).peerDependencies || {}),
}).reduce((calc, item) => {
  return Array.from(new Set([...calc, item]))
}, [])

export default defineConfig({
  plugins: [
    // 打包生成 .d.ts 声明文件
    dts({
      include: [path.resolve(__dirname, 'source/**/*')],
      outDir: path.resolve(__dirname, 'dist/types'),
      exclude: [path.resolve(__dirname, 'node_modules/**/*')],
    }),
  ],
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //   },
  // },
  // base: './',
  /**
   * 打包库模式
   * Packaging Library Mode
   */
  build: {
    lib: {
      entry: path.resolve(__dirname, './source/index.ts'),
      name: 'kuririn-funnel-chart',
      fileName: (format, entryName) => {
        if (format === 'umd') {
          return `kuririn-funnel-chart.${pkg.version}.js`
        }
        return `index.js`
      },
    },
    emptyOutDir: true,
    rollupOptions: {
      external: [
        ..._external, //
      ],
      output: [
        {
          format: 'es',
          dir: path.resolve(__dirname, 'dist/es'),
        },
        {
          format: 'cjs',
          dir: path.resolve(__dirname, 'dist/lib'),
        },
        {
          format: 'umd',
          name: 'kuririnFunnelChart',
          dir: path.resolve(__dirname, `dist/umd`),
        },
      ],
    },
  },
})
