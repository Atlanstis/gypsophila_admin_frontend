import { request } from '@/service';

/** 用户游戏信息 */
export function psProfileGameInfo(profileGameId: number) {
  return request.post<ResPsProfile.GameInfo>('/ps/profile/game/info', { profileGameId });
}
