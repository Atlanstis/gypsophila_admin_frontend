import { defineConfig } from 'unocss';
import presetUno from 'unocss/preset-uno';

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist', '.git', '.husky', '.vscode', 'public'],
    },
  },
  presets: [presetUno()],
  shortcuts: {
    'flex-col': 'flex flex-col',
  },
});
