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

const cacheMsgArr: Service.RequestError[] = [];

// 刷新时，如获取授权失败，等待 message 实例，加载完成后，显示错误信息
export function showCacheErrorMsg() {
  if (cacheMsgArr.length) {
    showErrorMsg(cacheMsgArr[0]);
    cacheMsgArr.length = 0;
  }
}

/**
 * 显示错误信息
 * @param error
 */
export function showErrorMsg(error: Service.RequestError) {
  // 刷新时，如获取授权失败，此时 message 时未完成加载，此处做缓存
  if (!window.$message) {
    cacheMsgArr.push(error);
    return;
  }

  if (!error.msg || hasErrorMsg(error)) return;

  addErrorMsg(error);
  window.console.warn(error.code, error.msg);
  window.$message?.error(error.msg, { duration: DEFAULT_MESSAGE_DURATION });
  setTimeout(() => {
    removeErrorMsg(error);
  }, DEFAULT_MESSAGE_DURATION);
}
