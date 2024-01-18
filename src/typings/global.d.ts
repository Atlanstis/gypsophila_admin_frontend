/** 给 window 对象增加 naive 组件相关调用 */
interface Window {
  $loadingBar?: import('naive-ui').LoadingBarProviderInst;
  $dialog?: import('naive-ui').DialogProviderInst;
  $message?: import('naive-ui').MessageProviderInst;
  $notification?: import('naive-ui').NotificationProviderInst;
}

/** 通用类型 */
declare namespace Common {
  /**
   * 策略模式
   * [状态, 为true时执行的回调函数]
   */
  type StrategyAction = [boolean, () => void];

  /** 异步组件 */
  type AsyncComponent = () => Promise<{ default: import('vue-router').RouteComponent }>;

  /** 组件/异步组件 */
  type Component = import('vue-router').RouteComponent | AsyncComponent;
}
