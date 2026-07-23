import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import heroProduct from "@/assets/hero-product.webp";
import collectionFlatlay from "@/assets/collection-flatlay.webp";
import fabricStack from "@/assets/fabric-stack.webp";
import { SHOP_URL } from "@/constants/shop";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const PREVIEW_IMAGES = [
  { src: heroProduct, alt: "Handmade JollyZu crossbody bag" },
  { src: collectionFlatlay, alt: "Collection of upcycled JollyZu bags" },
  { src: fabricStack, alt: "Stack of rescued textile scraps" },
] as const;

type VintedShopModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function VintedShopModal({ open, onOpenChange }: VintedShopModalProps) {
  const handleEnterShop = () => {
    window.open(SHOP_URL, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-ink/35 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          aria-describedby="vinted-shop-description"
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-ink/10 bg-cream p-8 shadow-brutal outline-none",
            "duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-[0.97] data-[state=open]:zoom-in-[0.97]",
            "data-[state=closed]:slide-out-to-top-[49%] data-[state=open]:slide-in-from-top-[49%]",
          )}
        >
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-full p-1 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <DialogHeader className="space-y-0 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-deep">
              Curated on Vinted
            </p>
            <DialogTitle className="text-display mt-3 text-2xl text-ink md:text-[1.65rem]">
              Every JollyZu piece is one-of-one ♡
            </DialogTitle>
            <DialogDescription
              id="vinted-shop-description"
              className="mt-4 text-l leading-relaxed text-ink/70"
            >
              Our collection currently lives on Vinted while the full JollyZu store is being
              crafted. You&apos;re about to enter our curated Vinted shop.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
            {PREVIEW_IMAGES.map((image) => (
              <PreviewThumbnail key={image.alt} src={image.src} alt={image.alt} />
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleEnterShop}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-cream transition-transform hover:-translate-y-0.5 hover:bg-purple-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Enter the Shop
              <span aria-hidden="true">↗</span>
            </button>
            <DialogPrimitive.Close
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-ink/60 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              Maybe Later
            </DialogPrimitive.Close>
          </div>

          <p className="mt-6 text-center text-xs text-ink/45">Secure checkout handled by Vinted</p>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function PreviewThumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-16 w-16 overflow-hidden rounded-lg border border-ink/10 bg-muted">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
