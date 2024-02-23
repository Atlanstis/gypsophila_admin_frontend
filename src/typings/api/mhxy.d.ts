declare namespace ApiMhxy {
  /** 角色 */
  interface AccountRole {
    /** 值 */
    value:
      | 'jxk'
      | 'wmr'
      | 'xys'
      | 'fyn'
      | 'msj'
      | 'ynx'
      | 'yxh'
      | 'ltz'
      | 'xce'
      | 'wtj'
      | 'stb'
      | 'yls'
      | 'mll-x'
      | 'spl'
      | 'gjl'
      | 'htg'
      | 'hmr'
      | 'jmw'
      | 'mll-m'
      | 'mqs';
    /** 角色名称 */
    label: string;
    /** 种族 */
    type: string;
  }

  /** 门派 */
  interface AccountSect {
    /** 值 */
    value:
      | 'dtgf'
      | 'fcs'
      | 'stl'
      | 'pts'
      | 'ycdf'
      | 'lg'
      | 'mwz'
      | 'hss'
      | 'yg'
      | 'nec'
      | 'xly'
      | 'hgs'
      | 'xmh';
    /** 门派名称 */
    label: string;
  }

  interface Account {
    id: string;
    /** 账号名称 */
    name: string;
    /** 是否是主号 */
    isPrimary: boolean;
    /** 角色 */
    role: AccountRole['value'];
    /** 门派 */
    sect: AccountSect['value'];
    /** 当前金币数 */
    gold: number;
  }
}
