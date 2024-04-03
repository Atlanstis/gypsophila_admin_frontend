import { useBoolean, usePagination } from '@/hooks';
import {
  scheduleTaskClose,
  scheduleTaskExecute,
  scheduleTaskList,
  scheduleTaskOpen,
} from '@/service';
import { NSpace, type DataTableColumns } from 'naive-ui';
import { h, ref, type Ref } from 'vue';
import { SCHEDULE_TASK_STATUS, SCHEDULE_TASK_STATUS_OPT } from '@/constants';
import { PopoverBtn } from '@/components';
import { ButtonIconEnum } from '@/enums';
import { useThemeStore } from '@/stores';

/** 有关列表的操作 */
export function useTaskTable() {
  const theme = useThemeStore();

  /** 立即执行当前任务 */
  async function onTaskExecute(row: ApiScheduleTask.ScheduleTask) {
    const { error } = await scheduleTaskExecute(row.key);
    if (!error) {
      window.$message?.success('执行成功');
      getTableData();
    }
  }

  async function onTaskOpen(row: ApiScheduleTask.ScheduleTask) {
    const { error } = await scheduleTaskOpen(row.key);
    if (!error) {
      window.$message?.success('执行成功');
      getTableData();
    }
  }

  async function onTaskClose(row: ApiScheduleTask.ScheduleTask) {
    const { error } = await scheduleTaskClose(row.key);
    if (!error) {
      window.$message?.success('执行成功');
      getTableData();
    }
  }

  const columns: Ref<DataTableColumns<ApiScheduleTask.ScheduleTask>> = ref([
    {
      key: 'name',
      title: '任务名称',
      align: 'center',
      minWidth: '100px',
    },
    {
      key: 'description',
      title: '任务描述',
      align: 'center',
      minWidth: '140px',
    },
    {
      key: 'lastRunTime',
      title: '上次执行时间',
      align: 'center',
      minWidth: '120px',
    },
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: '80px',
      render: ({ status }) => {
        const opt = SCHEDULE_TASK_STATUS_OPT.find((item) => item.value === status);
        const { otherColor } = theme;
        const colorMap: Record<SCHEDULE_TASK_STATUS, string> = {
          [SCHEDULE_TASK_STATUS.OPEN]: otherColor.success,
          [SCHEDULE_TASK_STATUS.CLOSE]: otherColor.error,
          [SCHEDULE_TASK_STATUS.INACTIVE]: otherColor.warning,
          [SCHEDULE_TASK_STATUS.IN_PROGRESS]: otherColor.info,
        };
        return opt ? h('span', { style: { color: colorMap[status] } }, opt.label) : '';
      },
    },
    {
      key: 'actions',
      title: '操作',
      align: 'center',
      width: '140px',
      render: (row) => {
        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => [
              SCHEDULE_TASK_STATUS.CLOSE === row.status || SCHEDULE_TASK_STATUS.OPEN === row.status
                ? h(PopoverBtn, {
                    msg: '立即执行',
                    icon: ButtonIconEnum.play,
                    onClick: () => onTaskExecute(row),
                  })
                : null,
              SCHEDULE_TASK_STATUS.CLOSE === row.status
                ? h(PopoverBtn, {
                    msg: '开启',
                    icon: ButtonIconEnum.check,
                    onClick: () => onTaskOpen(row),
                  })
                : null,
              SCHEDULE_TASK_STATUS.OPEN === row.status
                ? h(PopoverBtn, {
                    msg: '关闭',
                    icon: ButtonIconEnum.cross,
                    onClick: () => onTaskClose(row),
                  })
                : null,
            ],
          },
        );
      },
    },
  ]);

  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(true);

  const tableData = ref<ApiScheduleTask.ScheduleTask[]>([]);

  const { pagination, getPageParams } = usePagination(getTableData);

  async function getTableData() {
    startLoading();
    const { page, size } = getPageParams();
    const { data, error } = await scheduleTaskList(page, size);
    if (!error) {
      const { list, total } = data;
      tableData.value = list;
      pagination.itemCount = total;
    }
    endLoading();
  }

  return {
    /** 列表字段 */
    columns,
    /** 列表加载状态 */
    loading,
    /** 停止列表加载状态 */
    endLoading,
    /** 获取列表数据 */
    getTableData,
    /** 列表数据 */
    tableData,
    /** 分页信息 */
    pagination,
  };
}
