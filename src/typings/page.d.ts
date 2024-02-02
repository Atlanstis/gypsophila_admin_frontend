declare namespace PageRoute {
  /** 根路由 */
  type RootName = 'Root';

  /** 登录 */
  type LoginName = 'Login';

  /** 未匹配 */
  type NotFoundName = 'NotFound';

  /** 系统功能性 */
  type FunctionName = RootName | LoginName | NotFoundName;

  /** 工作台 */
  type WorkbenchName = 'Workbench';

  /** PlayStation 无对应页面路由名 */
  type PlayStationNoPageName = 'PlayStation';

  /** PlayStation 有对应页面路由名 */
  type PlayStationName =
    | 'PlayStation_Profile'
    | 'PlayStation_Profile_Game'
    | 'PlayStation_Game'
    | 'PlayStation_Search'
    | 'PlayStation_Analysis';

  /** PlayStation 路由名 */
  type AllPlayStationName = PlayStationNoPageName | PlayStationName;

  /** 系统管理 */
  type ManagementNoPageName = 'Management';
  type ManagementName = 'Management_User' | 'Management_Role' | 'Management_Menu';
  type AllManagementName = ManagementNoPageName | ManagementName;

  /** 系统设置 */
  type SettingNoPageName = 'Setting';
  type SettingName = 'Setting_Common';
  type AllSettingName = SettingNoPageName | SettingName;

  /** 全部路由名 */
  type AllRouteName =
    | FunctionName
    | WorkbenchName
    | AllPlayStationName
    | AllManagementName
    | AllSettingName;

  /** 全部有对应页面的路由名  */
  type HasPageRoute = Exclude<
    AllRouteName,
    RootName | PlayStationNoPageName | ManagementNoPageName | SettingNoPageName
  >;
}
