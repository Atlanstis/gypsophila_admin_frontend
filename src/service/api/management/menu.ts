import { request } from '@/service';

/**
 * 菜单列表
 * @param page - 页码
 * @param size - 数量
 */
export function menuList(page: number, size: number) {
  return request.post<ApiCommon.TableData<ApiManagement.Menu[]>>('/menu/list', { page, size });
}

/**
 * 获取所有顶级菜单
 */
export function menuListTop() {
  return request.get<ApiManagement.Menu[]>('/menu/list/top');
}

/**
 * 新增菜单
 * @param menu 菜单数据
 */
export function menuAdd(menu: Pick<ApiManagement.Menu, 'name' | 'key' | 'parentId'>) {
  return request.post('/menu/add', menu);
}

/**
 * 编辑菜单
 * @param menu 菜单数据
 */
export function menuEdit(menu: Pick<ApiManagement.Menu, 'name' | 'key' | 'parentId' | 'id'>) {
  return request.post('/menu/edit', menu);
}

/**
 * 删除菜单
 * @param menu 菜单数据
 */
export function menuDelete(menu: Pick<ApiManagement.Role, 'id'>) {
  return request.get('/menu/delete', menu);
}

/**
 * 获取菜单下所有可供操作的权限列表
 * @param menuId 菜单 id
 * @returns 权限列表
 */
export function menuPermissionList(menuId: number) {
  return request.post<ApiManagement.Permission[]>('/menu/permission/list', { menuId });
}
/**
 * 新增菜单下的权限
 * @param permission 权限
 */
export function menuPermissionAdd(
  permission: Pick<ApiManagement.Permission, 'name' | 'key'> & {
    id: number | null;
    menuId: number;
  },
) {
  return request.post('/menu/permission/add', permission);
}

/**
 * 编辑菜单下的权限
 * @param permission 权限
 */
export function menuPermissionEdit(
  permission: Pick<ApiManagement.Permission, 'name' | 'key'> & {
    id: number | null;
    menuId: number;
  },
) {
  return request.post('/menu/permission/edit', permission);
}

/**
 * 删除菜单下的权限
 * @param id 权限 id
 */
export function menuPermissionDelete(id: number) {
  return request.get('/menu/permission/delete', { id });
}

/** 获取当前菜单的操作权限 */
export function menuOperationPermission(key: string) {
  return request.post<System.OperationPermission>('/menu/operation/permission', { key });
}
