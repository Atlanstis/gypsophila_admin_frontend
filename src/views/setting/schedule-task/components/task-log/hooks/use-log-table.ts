import { useBoolean, usePagination } from '@/hooks';
import { scheduleTaskLogList } from '@/service';
import { type DataTableColumns } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { useThemeStore } from '@/stores';
import { SCHEDULE_TASK_LOG_STATUS, SCHEDULE_TASK_LOG_STATUS_OPT } from '@/constants';

/** 有关列表的操作 */
export function useLogTable() {
  const theme = useThemeStore();

  const columns: Ref<DataTableColumns<ApiScheduleTask.ScheduleTaskLog>> = ref([
    {
      key: 'executionTime',
      title: '执行时间',
      align: 'center',
    },
    {
      key: 'consumingTime',
      title: '耗时（秒）',
      align: 'center',
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      render: ({ status }) => {
        const opt = SCHEDULE_TASK_LOG_STATUS_OPT.find((item) => item.value === status);
        const { otherColor } = theme;
        const colorMap: Record<SCHEDULE_TASK_LOG_STATUS, string> = {
          [SCHEDULE_TASK_LOG_STATUS.SUCCESS]: otherColor.success,
          [SCHEDULE_TASK_LOG_STATUS.FAIL]: otherColor.error,
        };
        return opt ? h('span', { style: { color: colorMap[status] } }, opt.label) : '';
      },
    },
    {
      key: 'result',
      title: '结果',
      align: 'center',
      minWidth: '200px',
    },
  ]);

  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiScheduleTask.ScheduleTaskLog[]>([]);

  const { pagination, getPageParams } = usePagination(getTableData);

  const taskId = ref<number>(0);

  function setTaskId(value: number) {
    taskId.value = value;
  }

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await scheduleTaskLogList(page, size, taskId.value);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      pagination.itemCount = total;
    }
    endLoading();
  }

  return {
    setTaskId,
    /** 列表字段 */
    columns,
    /** 获取列表数据 */
    getTableData,
    /** 列表数据 */
    tableData,
    /** 分页信息 */
    pagination,
    loading,
  };
}
