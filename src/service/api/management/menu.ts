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
