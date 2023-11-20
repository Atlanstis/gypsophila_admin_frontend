import { DEFAULT_MESSAGE_DURATION } from '@/config';

/** 错误消息栈，防止同一错误同时出现 */
const errorMsgStack = new Map<string | number, string>([]);

function addErrorMsg(error: Service.RequestError) {
  errorMsgStack.set(error.code, error.msg);
}
function removeErrorMsg(error: Service.RequestError) {
  errorMsgStack.delete(error.code);
}
function hasErrorMsg(error: Service.RequestError) {
  return errorMsgStack.has(error.code);
}

/**
 * 显示错误信息
 * @param error
 */
export function showErrorMsg(error: Service.RequestError) {
  if (!error.msg || hasErrorMsg(error)) return;

  addErrorMsg(error);
  window.console.warn(error.code, error.msg);
  window.$message?.error(error.msg, { duration: DEFAULT_MESSAGE_DURATION });
  setTimeout(() => {
    removeErrorMsg(error);
  }, DEFAULT_MESSAGE_DURATION);
}
