export default function getDisPlayAddress(address: string): string {
  if(!address) {
    return '';
  }
  // 0xadb...dff
  return address.slice(0, 5) + '...' + address.slice(-3);

}