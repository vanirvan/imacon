interface ConvertImagesResponse {
  files: {
    dataUrl: string;
    mime: string;
    name: string;
    size: number;
  }[];
}

export async function convertImages(
  files: File[],
  targetFormat: string
): Promise<ConvertImagesResponse> {
  const formData = new FormData();
  formData.append("format", targetFormat);
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/convert-images`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = (await response.json()) as ConvertImagesResponse;
  return data;
}
