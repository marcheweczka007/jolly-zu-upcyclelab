import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [selected, setSelected] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border-2 border-ink bg-muted text-ink/40">
        No image
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="overflow-hidden rounded-2xl border-2 border-ink bg-muted shadow-brutal-lg">
        <img src={images[0]} alt={alt} className="aspect-[4/5] w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        ref={emblaRef}
        className="overflow-hidden rounded-2xl border-2 border-ink bg-muted shadow-brutal-lg"
      >
        <div className="flex">
          {images.map((src, i) => (
            <div key={src} className="min-w-0 flex-[0_0_100%]">
              <img
                src={src}
                alt={i === 0 ? alt : `${alt} — photo ${i + 1}`}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
              i === selected
                ? "border-purple-deep ring-2 ring-purple-deep/30"
                : "border-ink/20 opacity-70 hover:opacity-100",
            )}
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === selected ? "true" : undefined}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
