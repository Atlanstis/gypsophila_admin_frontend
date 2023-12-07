/** 父菜单标志 */
export const PARENT_FLAG = 0;

/** 权限操作类型 */
export enum PermissionTypeMenu {
  /** 查看列表 */
  List = 1,
  /** 新增 */
  Add = 2,
  /** 编辑 */
  Edit = 3,
  /** 删除 */
  Delete = 4,
  /** 其它 */
  Other = 0,
}

/** 权限操作类型选项 */
export const PermissionTypeOpts: { label: string; value: PermissionTypeMenu }[] = [
  { label: '查看列表', value: PermissionTypeMenu.List },
  { label: '新增', value: PermissionTypeMenu.Add },
  { label: '编辑', value: PermissionTypeMenu.Edit },
  { label: '删除', value: PermissionTypeMenu.Delete },
  { label: '其它', value: PermissionTypeMenu.Other },
];
