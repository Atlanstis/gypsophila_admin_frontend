declare namespace ApiManagement {
  interface Role {
    id: number;
    name: string;
    isDefault: 1 | 0;
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
    parentId: number;
    children: Menu[];
  }

  interface Permission {
    id: number;
    key: string;
    name: string;
    type: number;
  }
}
