declare namespace BusinessMhxy {
  type AccountFormModel = Omit<ApiMhxy.Account, 'role' | 'sect'> & {
    role?: ApiMhxy.AccountRole['value'];
    sect?: ApiMhxy.AccountSect['value'];
  };
}
