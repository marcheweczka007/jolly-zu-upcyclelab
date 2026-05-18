import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ShopCTA } from "@/components/ShopCTA";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - JollyZu | Get in touch" },
      {
        name: "description",
        content: "Custom orders, collabs, press, or just to say hi — get in touch with JollyZu.",
      },
      { property: "og:title", content: "Contact JollyZu" },
      { property: "og:description", content: "Custom orders, collabs, or press — drop a line." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  topic: z.string().min(1, "Pick a topic"),
  message: z.string().trim().min(10, "Tell me a bit more (10+ chars)").max(1000),
});

function Contact() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      topic: String(fd.get("topic") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      setStatus("error");
      return;
    }
    setErrors({});
    setStatus("success");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-8 md:px-8 md:pb-16 md:pt-16">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-purple-deep">Contact</p>
        <h1 className="text-display text-[14vw] leading-[0.85] md:text-[5rem]">
          Hi 👋
          <br />
          <span className="bg-mustard px-3 inline-block -rotate-1">let's chat!</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">
          Custom orders, collabs, donate old fabric, or just want to chat about my work? Send me a
          message.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:grid md:grid-cols-12 md:gap-16 md:px-8 md:pb-32">
        <div className="md:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl border-2 border-ink bg-cream p-6 shadow-brutal md:p-10"
          >
            {status === "success" && (
              <div className="rounded-lg border-2 border-leaf bg-leaf/20 p-4 text-sm font-bold">
                Thanks — your message is in. I'll reply within a few days.
              </div>
            )}

            <Field label="Your name" error={errors.name}>
              <input
                name="name"
                type="text"
                maxLength={100}
                required
                className={inputCls}
                placeholder="Joe Doe"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                name="email"
                type="email"
                maxLength={255}
                required
                className={inputCls}
                placeholder="you@email.com"
              />
            </Field>

            <Field label="What's it about?" error={errors.topic}>
              <select name="topic" required defaultValue="" className={inputCls}>
                <option value="" disabled>
                  Pick one…
                </option>
                <option value="custom">Custom order</option>
                <option value="collab">Collab / collaboration</option>
                <option value="press">Press / interview</option>
                <option value="stockist">Stockist enquiry</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Message" error={errors.message}>
              <textarea
                name="message"
                rows={6}
                maxLength={1000}
                required
                className={inputCls}
                placeholder="Tell me what you have in mind…"
              />
            </Field>

            <button
              type="submit"
              className="text-display inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-5 text-xl uppercase text-cream transition-transform hover:-translate-y-0.5 hover:bg-purple-deep md:w-auto md:px-10"
            >
              Send it →
            </button>
          </form>
        </div>

        <aside className="mt-12 space-y-8 md:col-span-5 md:mt-0">
          <div className="rounded-2xl bg-purple-deep p-8 text-cream">
            <p className="text-xs font-bold uppercase tracking-widest text-mustard">Studio</p>
            <p className="text-display mt-2 text-3xl">Edinburgh, UK</p>
            <p className="mt-2 text-cream/80">By appointment only - drop a line first.</p>
          </div>

          <div className="rounded-2xl border-2 border-ink p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-deep">
              Faster reply
            </p>
            <p className="text-display mt-2 text-3xl">DM on Instagram</p>
            <a
              href="https://instagram.com/upcycle.lab.jollyzu"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex font-bold underline underline-offset-4 hover:text-purple-deep"
            >
              @upcycle.lab.jollyzu ↗
            </a>
          </div>

          <div className="rounded-2xl bg-mustard p-8">
            <p className="text-display text-2xl">Just here to shop?</p>
            <p className="mb-5 mt-1 text-ink/70">Skip the form — head straight to the drop.</p>
            <ShopCTA variant="default" />
          </div>
        </aside>
      </section>

      <section className="bg-ink py-24 text-center text-cream md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <h2 className="text-display text-5xl md:text-8xl">
            Or just
            <br />
            <span className="text-mustard">shop the drop.</span>
          </h2>
          <div className="mt-12 flex justify-center">
            <ShopCTA variant="huge" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border-2 border-ink bg-cream px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-purple-deep focus:outline-none focus:ring-2 focus:ring-purple-deep/30";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-bold text-destructive">{error}</span>}
    </label>
  );
}
