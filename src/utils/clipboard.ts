/**
 * Safely copy text to clipboard with fallback for unfocused documents and iframe environments.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Attempt standard navigator.clipboard
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('navigator.clipboard.writeText failed, using fallback:', err);
  }

  // Fallback for unfocused document or non-secure context / iframe
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (fallbackErr) {
    console.error('All copy attempts failed:', fallbackErr);
    return false;
  }
}
