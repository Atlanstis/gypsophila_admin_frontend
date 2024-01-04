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
  export type TrophyNum = Record<PlayStation.TrophyType, number>;

  interface Troup {
    /** 奖杯名称 */
    name: string;
    /** 奖杯类型 */
    trophyType: PlayStation.TrophyType;
    /** 奖杯图标 */
    thumbnail: string;
    /** 奖杯描述 */
    description: string;
    /** 奖杯顺序 */
    order: number;
    /** 奖杯 id */
    psnineId: number;
    /** 提示数量 */
    tipNums: number;
    /** 完成率 */
    complateRate: number;
    /** 详情地址 */
    url: string;
    /** 奖杯 Id */
    id: number;
  }

  interface TrophyGroup {
    /** 奖杯组名称 */
    name: string;
    /** 缩略图 */
    thumbnail: string;
    /** 奖杯数量信息 */
    trophyNum: TrophyNum;
    /** 是否 DLC */
    isDLC: boolean;
    /** 奖杯信息 */
    trophies: Troup[];
  }

  /** 搜索游戏 */
  interface SearchGame {
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

  interface GameDetail {
    /** psnine 游戏 id */
    id: number;
    /** 游戏名称 */
    name: string;
    /** 游戏原名 */
    originName: string;
    /** 缩略图 */
    thumbnail: string;
    /** 上线平台 */
    platforms: PlayStation.Platform[];
    /** 奖杯数量 */
    trophyNum: TrophyNum;
    /** psnine 地址 */
    url: string;
    /** 完美难度 */
    perfectDiffucuity: PerfectDifficulty;
    /** 完美率 */
    perfectRate: number;
    /** 游玩人数 */
    players: number;
    /** 版本 */
    version: string[];
    /** 奖杯组信息 */
    trophyGroup: PsTrophyGroup[];
  }

  /** 游戏主题讨论 */
  interface GameTopic {
    /** id */
    id: number;
    /** 标题 */
    title: string;
    /** 详细地址 */
    url: string;
    /** 发布时间 */
    publicationTime: string;
    /** 讨论数 */
    discussTimes: number;
  }

  interface GameRank {
    /** 排名顺序 */
    index: number;
    /** 完成时间 */
    completionTime: string;
    /** 完成进度 */
    completionRate: number;
    /** 使用时间(单位:秒) */
    usedSecords: number;
    /** 使用时间(字符串) */
    usedTime: string;
  }
}
