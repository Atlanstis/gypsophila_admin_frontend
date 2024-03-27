import { MHXY_CHANNEL_DEFAULT_KEY } from '@/constants';
import {
  mhxyAccountAll,
  mhxyChannelList,
  mhxyPropCategoryList,
  mhxyAccountGroupList,
} from '@/service';
import type { TreeSelectOption } from 'naive-ui';
import { ref } from 'vue';
import { useBoolean } from '@/hooks';

interface TransferItem {
  name: string;
  id: number | string;
  children: TransferItem[];
}

/** 转换父种类字段映射 */
function transferKey<T extends TransferItem>(list: T[]): TreeSelectOption[] {
  return list.map((item) => {
    const children = transferKey(item.children);
    const opt: TreeSelectOption = {
      label: item.name,
      key: item.id,
    };
    if (children.length) {
      opt.children = children;
    }
    return opt;
  });
}

/** 提取 children */
function flatTree<T extends TransferItem>(list: T[], arr: Partial<T>[]) {
  return list.forEach((item) => {
    const children = item.children || [];
    if (children.length) {
      flatTree(children, arr);
    }
    const copy: Partial<T> = { ...item };
    delete copy.children;
    arr.push(copy);
  });
}

/** 获取道具种类 */
export function usePropCategoryList() {
  const propCategoryTree = ref<TreeSelectOption[]>([]);
  const propCategoryFlat = ref<Partial<ApiMhxy.PropCategory>[]>([]);

  /** 获取道具种类数据 */
  async function getPropCatrgory() {
    if (propCategoryTree.value.length > 0) return;
    const { error, data } = await mhxyPropCategoryList();
    if (!error) {
      propCategoryTree.value = transferKey<ApiMhxy.PropCategory>(data);
      flatTree<ApiMhxy.PropCategory>(data, propCategoryFlat.value);
    }
  }

  return { propCategoryTree, propCategoryFlat, getPropCatrgory };
}

/** 获取途径 */
export function useChannelList() {
  const channelTree = ref<TreeSelectOption[]>([]);
  const channelFlat = ref<Partial<ApiMhxy.Channel>[]>([]);

  /** 获取途径数据 */
  async function getChannel() {
    if (channelTree.value.length > 0) return;
    const { error, data } = await mhxyChannelList();
    if (!error) {
      const channel = data.filter((item) => item.key !== MHXY_CHANNEL_DEFAULT_KEY.GOLD_TRANSFER);
      channelTree.value = transferKey(channel);
      flatTree(channel, channelFlat.value);
    }
  }

  return { channelTree, channelFlat, getChannel };
}

/** 获取所有账号 */
export function useAccountAll() {
  const accountList = ref<ApiMhxy.Account[]>([]);

  /** 获取用户所有梦幻账号 */
  async function getAccountAll() {
    if (accountList.value.length > 0) return;
    const { error, data } = await mhxyAccountAll();
    if (!error) {
      accountList.value = data;
    }
  }

  return {
    accountList,
    getAccountAll,
  };
}

/** 获取账号分组列表 */
export function useAccountGroupList(showItem = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();

  const accountGroupData = ref<ApiMhxy.AccountGroup[]>([]);

  async function getAccountGroupData() {
    clearGroupData();
    startLoading();
    const { data, error } = await mhxyAccountGroupList(showItem);
    if (!error) {
      accountGroupData.value = data;
    }
    endLoading();
  }

  function clearGroupData() {
    accountGroupData.value = [];
  }

  /**
   * 将账号分组数据转换成符合 Select 组件的数据
   * @param exclude 需排除的账号 id 数组
   */
  function transferGroupSelect(exclude: ApiMhxy.Account['id'][] = []) {
    return accountGroupData.value
      .map((group) => {
        const children = group.items
          .map((item) => {
            return item.account;
          })
          .filter((account) => !exclude.includes(account.id));
        return {
          type: 'group',
          key: group.id,
          name: group.name,
          children,
        };
      })
      .filter((group) => group.children.length > 0);
  }

  return {
    loading,
    accountGroupData,
    getAccountGroupData,
    clearGroupData,
    transferGroupSelect,
  };
}
