/**
 * 策略模式
 * @param actions 执行第一个为 true 的策略
 */
export function exeStrategyActions(actions: Common.StrategyAction[]) {
  actions.some((item) => {
    const [flag, action] = item;
    if (flag) {
      action();
    }
    return flag;
  });
}
