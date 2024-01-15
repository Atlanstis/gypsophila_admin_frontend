import { Views } from '@/views';

/**
 * 获取路由对应的组件视图，并将组件试图名与路由名绑定
 * @param name 路由名称
 */
export function getRouteView(name: PageRoute.HasPageRoute) {
  const component = Views[name];
  // 给视图组件添加名称，用于在 keep-alive 下，include 及 exclude 属性与视图组件对应
  return async () => {
    const result = await component();
    Object.assign(result.default, { name });
    return result;
  };
}
