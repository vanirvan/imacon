import { ConvertImagesMenu } from "./components/landing-page/convert-images-menu";
import { Hero } from "./components/landing-page/hero";
import { storeUploadedFilesStore } from "./lib/stores/uploaded-files";

export default function App() {
  const { files } = storeUploadedFilesStore();

  return (
    <main className="bg-background text-foreground w-full min-h-[100svh]">
      {files.length > 0 ? <ConvertImagesMenu /> : <Hero />}
    </main>
  );
}
