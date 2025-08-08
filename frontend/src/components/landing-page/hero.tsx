import { storeUploadedFilesStore } from "@/lib/stores/uploaded-files";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";

export function Hero() {
  const { files, setFiles } = storeUploadedFilesStore();

  const handleDrop = (files: File[]) => {
    setFiles(files);
  };

  return (
    <section className="relative w-full min-h-[100svh]">
      <div className="relative container w-full min-h-[100svh] mx-auto px-4 xl:px-0 flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-center text-4xl font-bold">
            Convert images to other formats
          </h1>
          <p className="text-center text-lg text-muted-foreground">
            Convert images to other formats with our powerful image converter.
          </p>
        </div>
        <div className="w-full max-w-md cursor-pointer">
          <Dropzone
            maxSize={1024 * 1024 * 10}
            minSize={1024}
            maxFiles={999999999}
            accept={{ "image/*": [] }}
            onDrop={handleDrop}
            src={files}
            onError={console.error}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
      </div>
    </section>
  );
}
