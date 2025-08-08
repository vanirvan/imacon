import { useMemo, useState } from "react";
import { storeUploadedFilesStore } from "@/lib/stores/uploaded-files";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { convertSizeToHumanReadable } from "@/lib/utils/readable-size";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Dropzone, DropzoneEmptyState } from "@/components/ui/dropzone";
import { ChevronDownIcon, Trash2Icon } from "lucide-react";
import { convertImages } from "@/lib/fetches";

const IMAGE_FORMATS = ["png", "jpeg", "webp", "avif", "tiff", "gif"] as const;

type ImageItem = {
  id: string;
  name: string;
  src: string;
  size: number;
};

export function ConvertImagesMenu() {
  const [targetFormat, setTargetFormat] =
    useState<(typeof IMAGE_FORMATS)[number]>("png");

  // Placeholder images for layout preview (replace with real files later)
  const { files, setFiles } = storeUploadedFilesStore();
  const images = useMemo<ImageItem[]>(
    () =>
      files.map((file) => ({
        id: `${file.name}-${file.size}-${(file as File).lastModified}`,
        name: file.name,
        src: URL.createObjectURL(file),
        size: file.size,
      })),
    [files]
  );

  const handleDeleteImage = (idx: number) => {
    URL.revokeObjectURL(images[idx].src);
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleConvertImages = async () => {
    const { files: converted } = await convertImages(files, targetFormat);
    converted.forEach((f, index) => {
      const link = document.createElement("a");
      link.href = f.dataUrl;
      link.download = f.name;
      document.body.appendChild(link);
      // Stagger a bit to avoid some browsers blocking multiple downloads
      setTimeout(() => {
        link.click();
        link.remove();
      }, index * 50);
    });
  };

  return (
    <section className="relative w-full min-h-[100svh]">
      <div className="relative container w-full mx-auto px-4 xl:px-0 flex flex-col gap-6 py-6">
        {/* Toolbar */}
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm sm:text-base opacity-80">Convert to</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline">
                  {targetFormat === "jpeg"
                    ? "JPEG (.jpg/.jpeg)"
                    : targetFormat.toUpperCase()}
                  <ChevronDownIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                  value={targetFormat}
                  onValueChange={(v) =>
                    setTargetFormat(v as (typeof IMAGE_FORMATS)[number])
                  }
                >
                  {IMAGE_FORMATS.map((fmt) => (
                    <DropdownMenuRadioItem key={fmt} value={fmt}>
                      {fmt === "jpeg" ? "JPEG (.jpg/.jpeg)" : fmt.toUpperCase()}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button className="cursor-pointer" onClick={handleConvertImages}>
            Convert
          </Button>
        </div>

        {/* File list grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.length === 0 ? (
            <div className="col-span-full text-center text-sm opacity-70">
              No images
            </div>
          ) : (
            images.map((img, idx) => (
              <Dialog key={img.id}>
                <DialogTrigger asChild>
                  <Card key={img.id} className="overflow-hidden p-0">
                    <div className="relative group w-full aspect-video overflow-hidden">
                      <img
                        src={img.src}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all z-10 border-destructive text-destructive hover:bg-destructive hover:text-white hover:border-destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteImage(idx);
                        }}
                        aria-label={`Remove ${img.name}`}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <div className="text-sm font-medium truncate">
                          {img.name}
                        </div>
                        <div className="text-xs opacity-90">
                          {convertSizeToHumanReadable(img.size)}
                        </div>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="p-0">
                  <DialogHeader>
                    <img
                      src={img.src}
                      alt={img.name}
                      className="w-full h-full"
                    />
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))
          )}
        </div>

        <div>
          <Dropzone
            accept={{ "image/*": [] }}
            multiple
            maxFiles={999999999}
            onDrop={(acceptedFiles) => {
              if (!acceptedFiles?.length) return;
              setFiles([...files, ...acceptedFiles]);
            }}
            className="justify-center text-center gap-2"
          >
            <DropzoneEmptyState />
          </Dropzone>
        </div>
      </div>
    </section>
  );
}
