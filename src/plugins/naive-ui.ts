import { computed } from 'vue';

import { createDiscreteApi } from 'naive-ui';
import { useThemeStore } from '@/stores';

/** message 默认停留时间（ms） */
export const DEFAULT_MESSAGE_DURATION = 2 * 1000;

/**
 * 注册 naive UI 组件，并挂载到 window 对象上；
 * 包含 dialog, loadingBar, message, notification。
 * @important 需在 setupRouter 之前调用，防止 message 未加载完成时，无法显示错误信息
 */
export function setupNaive() {
  const theme = useThemeStore();

  const themeProviderProps = computed(() => ({
    themeOverrides: theme.naiveThemeOverrides,
  }));

  const { dialog, loadingBar, message, notification } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
    {
      configProviderProps: themeProviderProps,
      loadingBarProviderProps: {},
      messageProviderProps: {
        duration: DEFAULT_MESSAGE_DURATION,
      },
      notificationProviderProps: {},
    },
  );
  window.$dialog = dialog;
  window.$loadingBar = loadingBar;
  window.$message = message;
  window.$notification = notification;
}
