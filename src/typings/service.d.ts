/** 数据请求相关 */
declare namespace Service {
  /** 自定义返回码 */
  enum CustomCodeEnum {
    /** 成功 */
    SUCCESS = 0,
    /** 失败 */
    FAIL = -1,
  }

  /** 自定义的请求结果 */
  interface RequestResult<T = any> {
    /** 返回数据 */
    data: T;
    /** 提示信息 */
    msg: string;
    /** 接口状态 */
    code: CustomCodeEnum;
  }
}
