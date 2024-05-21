import { EnumNoticeCategory, type Notice } from '@/typings';

export function isMhxyGoldTransferNotice(
  notice: Notice | null,
): notice is Notice<EnumNoticeCategory.MhxyTransfer> {
  return !!notice && notice.category === EnumNoticeCategory.MhxyTransfer;
}
