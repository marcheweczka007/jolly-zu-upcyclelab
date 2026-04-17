export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-mustard py-4">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-display flex items-center gap-12 text-2xl uppercase md:text-3xl">
            {item}
            <span className="text-purple-deep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
