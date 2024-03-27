import { mhxyRoleImgMap } from '@/assets';
import { useIconRender } from '@/composables';
import { MHXY_GOLD_RECORD_TYPE } from '@/constants';
import { ButtonIconEnum } from '@/enums';
import { useThemeStore } from '@/stores';
import { NAvatar, NNumberAnimation, NPopover, NSpace, NTag } from 'naive-ui';
import { h } from 'vue';

/**
 * 绘制收支情况
 * @param expenditureAmount 支出金额
 * @param revenueAmount 收入金额
 */
export function renderTransferAmount(expenditureAmount: number, revenueAmount: number) {
  return h(
    NPopover,
    {},
    {
      trigger: () =>
        h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              renderGoldTrend(expenditureAmount, 'expenditure'),
              h('span', '/'),
              renderGoldTrend(revenueAmount, revenueAmount !== 0 ? 'revenue' : undefined),
            ],
          },
        ),
      default: () => h('div', [h('div', `损耗：${expenditureAmount - revenueAmount}`)]),
    },
  );
}

/** 绘制转金关系 */
export function renderTransferRelation(from: ApiMhxy.Account, to: ApiMhxy.Account) {
  const { iconRender } = useIconRender();
  const themeStore = useThemeStore();
  const { themeColor } = themeStore;
  return [
    renderMhxyAccount(from),
    h(iconRender({ fontSize: 18, icon: ButtonIconEnum.arrowRight, color: themeColor })),
    renderMhxyAccount(to),
  ];
}

/** Table 组件，金币趋势 */
export function renderGoldTrend(amount: number, type?: BusinessMhxy.GoldRecordType) {
  const { iconRender } = useIconRender();
  const themeStore = useThemeStore();
  const { success, error, info } = themeStore.otherColor;

  return h(
    NSpace,
    {
      justify: 'center',
      align: 'center',
      style: {
        color:
          type === MHXY_GOLD_RECORD_TYPE.REVENUE
            ? success
            : type === MHXY_GOLD_RECORD_TYPE.EXPENDITURE
            ? error
            : info,
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
            icon:
              type === MHXY_GOLD_RECORD_TYPE.REVENUE
                ? ButtonIconEnum.increase
                : type === MHXY_GOLD_RECORD_TYPE.EXPENDITURE
                ? ButtonIconEnum.decrease
                : ButtonIconEnum.flat,
          }),
        ),
      ],
    },
  );
}

/** Table 组件，账号信息展示 */
export function renderMhxyAccount(account: ApiMhxy.Account) {
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
              { default: () => '主' },
            )
          : null,
      ],
    },
  );
}

/** Select 组件，梦幻账号 Label */
export function renderAccountLabel(account: ApiMhxy.Account) {
  return account.role
    ? h(
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
      )
    : h('div', account.name);
}
