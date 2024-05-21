import { useRouter, type RouteLocationRaw } from 'vue-router';
import { router as globalRouter } from '@/router';
import { RouteEnum } from '@/enums';
import { useRouteStore } from '@/stores';
import { urlRegex } from '@/constants';
import { DEFAULT_MESSAGE_DURATION } from '@/config';

/**
 * 路由跳转
 * @param isInSetup - 是否在 vue 页面/组件的 setup 里面调用，例如在 axios 里面使用 useRouter 和 useRoute 将返回 undefined
 */
export function useRouterPush(isInSetup = true) {
  const router = isInSetup ? useRouter() : globalRouter;
  const route = router.currentRoute;

  /** 跳转到外部地址 */
  function toOutsideUrl(url: string) {
    if (urlRegex.test(url)) {
      window.open(url);
    } else {
      window.$message?.error(`该地址(${url})不符合格式`, { duration: DEFAULT_MESSAGE_DURATION });
    }
  }

  /**
   * 路由跳转
   * @param to - 需要跳转的路由
   * @param newTab - 是否在新的浏览器标签中打开
   */
  function routerPush(to: RouteLocationRaw, newTab = false) {
    if (newTab) {
      const { href } = router.resolve(to);
      window.open(href, '_blank');
      return Promise.resolve();
    }
    return router.push(to);
  }

  /** 返回上一页 */
  function goBack() {
    return router.go(-1);
  }

  /**
   * 跳转首页
   * @param newTab - 是否在新的浏览器标签中打开
   */
  function toHome(newTab = false) {
    routerPush({ name: RouteEnum.Root }, newTab);
  }

  /**
   * 登录成功后跳转重定向的地址
   */
  function toLoginRedirect() {
    const { query } = route.value;
    if (query?.redirect) {
      routerPush(query.redirect as string);
    } else {
      toHome();
    }
  }

  /**
   * 跳转登录页面
   * @param redirectUrl - 重定向地址(登录成功后跳转的地址)，默认 undefined 表示取当前地址为重定向地址
   */
  function toLogin(redirectUrl?: string) {
    const routeLocation: RouteLocationRaw = {
      name: RouteEnum.Login,
    };
    let redirect = redirectUrl === undefined ? route.value.fullPath : redirectUrl;
    const routeStore = useRouteStore();
    // 读取因认证失败，未能正确获取 redirect 的值
    if (redirect === '/') {
      redirect = routeStore.redirect;
      routeStore.setRedirect('');
    }
    // 添加跳转信息
    if (redirect) {
      Object.assign(routeLocation, { query: { redirect } });
    }
    routerPush(routeLocation);
  }

  return {
    toOutsideUrl,
    goBack,
    routerPush,
    toLogin,
    toHome,
    toLoginRedirect,
    router,
    route,
  };
}
