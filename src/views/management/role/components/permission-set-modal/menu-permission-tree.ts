import { defineComponent, h, type PropType, type VNode } from 'vue';
import { NCheckbox, NText, NButton } from 'naive-ui';

export default defineComponent({
  name: 'MenuPermissionTree',
  props: {
    // 菜单树数据
    menuTree: {
      type: Array as PropType<ResMenu.MenuWithChildren[]>,
      default: () => [],
    },
    // 菜单选中状态
    menuChecked: {
      type: Object as PropType<Record<string, boolean>>,
      default: () => ({}),
    },
    // 权限选中状态
    permissionMap: {
      type: Object as PropType<Record<string, number[]>>,
      default: () => ({}),
    },
  },
  emits: ['update:menuChecked', 'update:permissionMap'],
  setup(props, { emit }) {
    // 处理菜单选中状态变化
    const handleMenuCheck = (menuId: number, checked: boolean) => {
      const newMenuChecked = { ...props.menuChecked, [menuId]: checked };
      emit('update:menuChecked', newMenuChecked);
    };

    // 处理权限选中状态变化
    const handlePermissionCheck = (menuId: number, permissionId: number, checked: boolean) => {
      const currentPermissions = [...(props.permissionMap[menuId] || [])];
      const newPermissions = checked
        ? [...currentPermissions, permissionId]
        : currentPermissions.filter((id) => id !== permissionId);

      const newPermissionMap = { ...props.permissionMap, [menuId]: newPermissions };
      emit('update:permissionMap', newPermissionMap);
    };

    // 渲染权限选项
    const renderPermissions = (permissions: ResMenu.MenuPermission[], menuId: number) => {
      return h(
        'div',
        { style: { display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' } },
        permissions.map((permission) => {
          const isChecked = (props.permissionMap[menuId] || []).includes(permission.id);

          return h(
            NButton,
            {
              size: 'small',
              type: isChecked ? 'primary' : 'default',
              quaternary: true,
              style: {
                padding: '4px 12px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                backgroundColor: isChecked
                  ? 'rgba(var(--primary-color), .1)'
                  : 'rgba(229, 231, 235, 0.5)',
                color: isChecked ? 'rgba(var(--primary-color))' : 'rgb(75, 85, 99)',
              },
              onClick: () => handlePermissionCheck(menuId, permission.id, !isChecked),
            },
            { default: () => permission.name },
          );
        }),
      );
    };

    // 渲染菜单节点（递归方式）
    const renderMenuNode = (menu: ResMenu.MenuWithChildren, level = 0): VNode => {
      const isChecked = !!props.menuChecked[menu.id];

      return h(
        'div',
        {
          style: {
            transition: 'all 0.3s ease',
          },
        },
        [
          // 菜单项头部
          h(
            'div',
            {
              style: {
                padding: '8px',
                borderRadius: '8px',
                transition: 'background-color 0.3s',
                backgroundColor: 'white',
                cursor: 'pointer',
              },
              onMouseover: (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(243, 244, 246, 1)';
              },
              onMouseout: (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
              },
            },
            [
              h('div', [
                h(NCheckbox, {
                  checked: isChecked,
                  style: { marginRight: '12px' },
                  onUpdateChecked: (checked: boolean) => handleMenuCheck(menu.id, checked),
                }),
                h(NText, { strong: level === 0 }, { default: () => menu.name }),
              ]),
              // 渲染权限选项
              menu.permissions && menu.permissions.length > 0
                ? h('div', { style: { paddingLeft: '32px', marginTop: '6px' } }, [
                    h(
                      NText,
                      {
                        depth: 3,
                        style: { fontSize: '14px', color: 'rgb(107, 114, 128)' },
                      },
                      { default: () => '权限：' },
                    ),
                    renderPermissions(menu.permissions, menu.id),
                  ])
                : null,
            ],
          ),

          // 递归渲染子菜单
          menu.children && menu.children.length > 0
            ? h(
                'div',
                { style: { paddingLeft: '32px' } },
                menu.children.map((child) => renderMenuNode(child, level + 1)),
              )
            : null,
        ],
      );
    };

    return () => {
      return h(
        'div',
        {},
        props.menuTree.map((menu) => renderMenuNode(menu)),
      );
    };
  },
});
