import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
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

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleMainImageClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!emblaApi || (event.target as HTMLElement).closest("button")) return;

      const { left, width } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      if (x < width / 2) scrollPrev();
      else scrollNext();
    },
    [emblaApi, scrollPrev, scrollNext],
  );

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

  const arrowClassName =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ink bg-cream/95 text-ink shadow-brutal transition hover:bg-cream active:scale-95";

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-ink bg-muted shadow-brutal-lg"
        onClick={handleMainImageClick}
      >
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {images.map((src, i) => (
              <div key={src} className="min-w-0 flex-[0_0_100%]">
                <img
                  src={src}
                  alt={i === 0 ? alt : `${alt} — photo ${i + 1}`}
                  className="aspect-[4/5] w-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            scrollPrev();
          }}
          className={cn(arrowClassName, "left-3")}
          aria-label="Previous photo"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            scrollNext();
          }}
          className={cn(arrowClassName, "right-3")}
          aria-label="Next photo"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
        </button>
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
