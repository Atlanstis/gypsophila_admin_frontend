declare namespace ApiManagement {
  interface Role {
    id: number;
    name: string;
    desc: string;
  }

  interface User {
    id: string;
    username: string;
    nickname: string;
    avatar?: string;
    roles: Role[];
    createTime: string;
  }

  interface Menu {
    id: number;
    key: string;
    name: string;
    type: string;
    children: Menu[];
    parentId: number | null;
  }

  interface Permission {
    id: number;
    key: string;
    name: string;
    alias: string;
    order: number;
  }
}
