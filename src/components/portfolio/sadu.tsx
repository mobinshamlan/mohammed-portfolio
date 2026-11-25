/*
 * Temporary stand-in while the case pages drop their bands; renders nothing.
 * Remove once nothing imports it.
 */
export type SaduVariant = string;

export function SaduBand(_props: { variant?: SaduVariant; size?: string; orient?: string; className?: string }) {
  void _props;
  return null;
}
