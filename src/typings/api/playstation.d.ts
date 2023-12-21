declare namespace PlayStation {
  /**平台信息 */
  type Platform = 'PS3' | 'PSV' | 'PS4' | 'PS5';

  /** 奖杯类型 */
  type TrophyType = 'platinum' | 'gold' | 'silver' | 'bronze';
}

declare namespace Psnine {
  /** 完美困难度 */
  type PerfectDifficulty = '极易' | '容易' | '普通' | '麻烦' | '困难' | '地狱';

  /** 奖杯数量信息 */
  export type TrophyNum = Record<PlayStation.TrophyType, nunber>;

  /** 搜索游戏 */
  interface SearchPsGame {
    /** psnine 游戏 id */
    id: number;
    /** 游戏名称 */
    name: string;
    /** 详细地址 */
    url: string;
    /** 缩略图 */
    thumbnail: string;
    /** 上线平台 */
    platforms: PlayStation.Platform[];
    /** 奖杯数量 */
    trophyNum: TrophyNum;
    /** 完美难度 */
    perfectDiffucuity: PerfectDifficulty;
    /** 完美率  */
    perfectRate: number;
    /** 游玩人数 */
    players: number;
    /** 版本 */
    version: string[];
  }
}
