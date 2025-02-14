/**
 * 计算游戏完成率
 */
export function calcCompleteRate(profileGame: PlayStation.ProfileGame, game: PlayStation.Game) {
  const {
    bronze: bronzeGot,
    silver: silverGot,
    gold: goldGot,
    platinum: platinumGot,
  } = profileGame;
  const [bronzeSg, silverSg, goldSg, platinumSg] = [1, 2, 6, 3];
  const { bronze, silver, gold, platinum } = game;
  return Math.round(
    (100 *
      (bronzeSg * bronzeGot + silverSg * silverGot + goldSg * goldGot + platinumSg * platinumGot)) /
      (bronzeSg * bronze + silverSg * silver + goldSg * gold + platinumSg * platinum),
  );
}
