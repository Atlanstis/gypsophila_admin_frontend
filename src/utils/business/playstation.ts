/**
 * 计算 psn 游戏完成率
 * @param info 游戏
 * @returns 完成率
 */
export function calcCompleteRate(info: ApiPsn.ProfileGame) {
  const {
    bronzeGot,
    silverGot,
    goldGot,
    platinumGot,
    game: { bronze, silver, gold, platinum },
  } = info;
  return Math.round(
    (100 * (1 * bronzeGot + 2 * silverGot + 6 * goldGot + 3 * platinumGot)) /
      (1 * bronze + 2 * silver + 6 * gold + 3 * platinum),
  );
}
