declare namespace ApiManagement {
  interface Role {
    id: number;
    name: string;
  }

  interface User {
    id: string;
    username: string;
    nickname: string;
    avatar?: string;
    roles: Role[];
    createTime: string;
  }
}
