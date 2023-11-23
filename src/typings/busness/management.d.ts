declare namespace BusinessManagement {
  type User = ApiManagement.User & {
    password: string;
  };
}
