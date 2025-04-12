export const copyToClipboard = (text: string): void => {
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(text).catch(console.error);
  }
};
