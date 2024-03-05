import { mhxyRoleImgMap } from '@/assets';
import { useIconRender } from '@/composables';
import { ButtonIconEnum } from '@/enums';
import { useThemeStore } from '@/stores';
import { NAvatar, NNumberAnimation, NSpace, NTag } from 'naive-ui';
import { h } from 'vue';

/** Table 组件，金币趋势 */
export function renderGoldTrend(amount: number) {
  const { iconRender } = useIconRender();
  const themeStore = useThemeStore();
  const { success, error } = themeStore.otherColor;

  return h(
    NSpace,
    {
      justify: 'center',
      align: 'center',
      style: {
        color: amount > 0 ? success : error,
      },
    },
    {
      default: () => [
        h(NNumberAnimation, {
          from: 0,
          to: amount,
          duration: 1000,
          showSeparator: true,
        }),
        h(
          iconRender({
            fontSize: 18,
            icon: amount > 0 ? ButtonIconEnum.increase : ButtonIconEnum.decrease,
          }),
        ),
      ],
    },
  );
}

/** Table 组件，账号信息展示 */
export function renderTableAccount(account: ApiMhxy.Account) {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    {
      default: () => [
        h(NAvatar, {
          src: mhxyRoleImgMap[account.role],
          round: true,
          color: '#fff',
          size: 'small',
        }),
        h(
          'span',
          {
            style: { marginLeft: '8px' },
          },
          account.name,
        ),
        account.isPrimary
          ? h(
              NTag,
              { size: 'small', type: 'primary', style: { marginLeft: '8px' } },
              { default: () => '主号' },
            )
          : null,
      ],
    },
  );
}

/** Select 组件，梦幻账号 Label */
export function renderAccountLabel(account: ApiMhxy.Account) {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
    [
      h(NAvatar, {
        src: mhxyRoleImgMap[account.role],
        round: true,
        size: 'small',
      }),
      h(
        'div',
        {
          style: {
            marginLeft: '12px',
            padding: '4px 0',
          },
        },
        [account.name],
      ),
    ],
  );
}
