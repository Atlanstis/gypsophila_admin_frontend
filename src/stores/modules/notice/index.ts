import { useRouterPush } from '@/composables';
import { RouteEnum } from '@/enums';
import { ApiNoticePolymeric } from '@/service';
import { EnumNoticeCategory, EnumNoticeType, type Notice } from '@/typings';
import { exeStrategyActions } from '@/utils';
import { defineStore } from 'pinia';

interface NoticeStore {
  /** 待办列表 */
  todos: Notice[];
  /** 消息列表 */
  messages: Notice[];
  /** 生效的待办 */
  activeTodo: Notice | null;
  /** 弹出信息是否展示 */
  visible: boolean;
}

export const useNoticeStore = defineStore('notice-store', {
  state: (): NoticeStore => ({
    todos: [],
    messages: [],
    activeTodo: null,
    visible: false,
  }),

  getters: {
    /** 待办数量 */
    todoCount(): number {
      return this.todos.length;
    },
    /** 消息数量 */
    messageCount(): number {
      return this.messages.length;
    },

    /** 总消息数 */
    totalCount(): number {
      return this.todoCount + this.messageCount;
    },
  },

  actions: {
    /** 获取系统顶部通知 */
    async getNoticePolymeric() {
      const { error, data } = await ApiNoticePolymeric();
      if (!error) {
        const todos: Notice[] = [];
        const messages: Notice[] = [];
        data.forEach((item) => {
          if (item.type === EnumNoticeType.Todo) {
            todos.push(item);
          } else if (item.type === EnumNoticeType.Message) {
            messages.push(item);
          }
        });
        this.messages = messages;
        this.todos = todos;
      }
    },

    /** 待办处理 */
    async onTodoHandle(notice: Notice) {
      if (notice.type !== EnumNoticeType.Todo) return;
      const { route, routerPush } = useRouterPush(false);
      this.activeTodo = notice;
      const actions: Common.StrategyAction[] = [
        [
          notice.category === EnumNoticeCategory.MhxyTransfer,
          async () => {
            if (route.value.name !== RouteEnum.MhxyGoldTransfer) {
              await routerPush({ name: RouteEnum.MhxyGoldTransfer });
            }
            this.setVisible(false);
          },
        ],
      ];
      await exeStrategyActions(actions);
    },

    /** 控制通知面板显示 */
    setVisible(val: boolean) {
      this.visible = val;
    },

    /** 清除生效的待办 */
    clearActiveTodo() {
      if (this.activeTodo) {
        this.activeTodo = null;
      }
    },
  },
});
