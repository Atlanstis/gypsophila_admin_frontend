import type { PaginationProps } from 'naive-ui';
import { reactive } from 'vue';

/**
 * 处理列表分页
 * @param cb 页码或单页长度发生变化时，回调函数
 * @returns pagination 对象
 */
export function usePagination(cb: () => void) {
  /** 分页对象 */
  const pagination: PaginationProps = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    showSizePicker: true,
    pageSizes: [10, 20, 50],
    prefix({ itemCount }) {
      return `总计: ${itemCount} 条`;
    },
    onChange: (page: number) => {
      pagination.page = page;
      cb();
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.pageSize = pageSize;
      pagination.page = 1;
      cb();
    },
  });

  /**
   * 获取当前分页参数
   * @returns { page, size }
   */
  function getPageParams() {
    return {
      page: pagination.page as number,
      size: pagination.pageSize as number,
    };
  }

  return { pagination, getPageParams };
}
