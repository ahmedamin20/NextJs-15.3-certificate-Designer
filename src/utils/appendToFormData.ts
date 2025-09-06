const appendToFormData = (formData: FormData, data: Record<string, any>) => {
  Object.entries(data).forEach(([key, value]) => {
    const isPhotoKey =
      key.includes("url") ||
      key.includes("Url") ||
      key.includes("photo") ||
      key.includes("Photo") ||
      key.includes("Logo") ||
      key.includes("logo") ||
      key.includes("image") ||
      key.includes("Image");

    // ⬇️ Skip "videoUrl" entirely
    if (key === "videoUrl" || key === "VideoUrl") {
      formData.append(key, value);
    }

    if (isPhotoKey) {
      if (value instanceof File) {
        formData.append(key, value);
      }
      // if it's not a File, skip
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
};

export default appendToFormData;
