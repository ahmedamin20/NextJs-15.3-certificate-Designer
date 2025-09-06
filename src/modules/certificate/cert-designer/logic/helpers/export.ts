export async function exportElementToPNG(el: HTMLElement): Promise<string> {
const { default: html2canvas } = await import("html2canvas");
const canvas = await html2canvas(el, { backgroundColor: null, scale: Math.max(2, window.devicePixelRatio || 1) });
return canvas.toDataURL("image/png");
}