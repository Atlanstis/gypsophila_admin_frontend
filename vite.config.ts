import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

import UnoCSS from 'unocss/vite';

import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

const ICON_PREFIX = 'icon';
const ICON_LOCAL_COLLECTION = 'local';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // https://unocss.dev/guide/
    UnoCSS(),

    // https://github.com/antfu/unplugin-icons
    Icons({
      compiler: 'vue3',
      scale: 1,
      defaultClass: 'inline-block',
      customCollections: {
        [ICON_LOCAL_COLLECTION]: FileSystemIconLoader('src/assets/icons', (svg) =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" '),
        ),
      },
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dts: 'src/typings/components.d.ts',
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [
        NaiveUiResolver(),
        IconsResolver({ customCollections: [ICON_LOCAL_COLLECTION], componentPrefix: ICON_PREFIX }),
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/scss/global.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
