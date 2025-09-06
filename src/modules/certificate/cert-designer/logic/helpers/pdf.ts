export async function rasterizePdfFirstPage(
  file: File
): Promise<{ dataUrl: string; w: number; h: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const { getDocument, GlobalWorkerOptions, version } = await import(
    "pdfjs-dist"
  );
  GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;
  return {
    dataUrl: canvas.toDataURL("image/png"),
    w: canvas.width,
    h: canvas.height,
  };
}
