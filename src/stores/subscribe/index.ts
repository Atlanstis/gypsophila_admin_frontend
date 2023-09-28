import { effectScope, onScopeDispose, watch } from 'vue';
import type { GlobalThemeOverrides } from 'naive-ui';
import { kebabCase } from 'lodash-es';
import { getRgbOfColor } from '@/utils';
import { useThemeStore } from '../modules';

export function subscribeThemeStore() {
  const theme = useThemeStore();

  const effect = effectScope();

  effect.run(() => {
    watch(
      () => theme.naiveThemeOverrides,
      (newValue) => {
        if (newValue.common) {
          addThemeCssVarsToHtml(newValue.common);
        }
      },
      {
        immediate: true,
      },
    );
  });

  onScopeDispose(() => {
    effect.stop();
  });
}

type ThemeVars = Exclude<GlobalThemeOverrides['common'], undefined>;
type ThemeVarsKeys = keyof ThemeVars;

/** 添加css vars至html */
function addThemeCssVarsToHtml(themeVars: ThemeVars) {
  const keys = Object.keys(themeVars) as ThemeVarsKeys[];
  const style: string[] = [];
  keys.forEach((key) => {
    const color = themeVars[key];

    if (color) {
      const { r, g, b } = getRgbOfColor(color);
      style.push(`--${kebabCase(key)}: ${r},${g},${b}`);
    }
  });
  const styleStr = style.join(';');
  document.documentElement.style.cssText += styleStr;
}

/** 订阅状态 */
export function subscribeStore() {
  subscribeThemeStore();
}
