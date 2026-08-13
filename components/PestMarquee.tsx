// Full-bleed, seamless left-to-right ticker shown right under the hero
// image on the homepage. Rendered outside any max-w container so there is
// no left/right gap on wide desktop screens, and the item list is
// duplicated once so the CSS animation (see globals.css `.animate-marquee`)
// loops with no visible seam or blank frame.
const PEST_ITEMS = [
  { icon: "🦋", label: "Güve İlaçlama" },
  { icon: "🪳", label: "Hamam Böceği İlaçlama" },
  { icon: "☕", label: "Kafe İlaçlama" },
  { icon: "📦", label: "Depo İlaçlama" },
  { icon: "🏫", label: "Okul İlaçlama" },
  { icon: "🦗", label: "Pire İlaçlama" },
  { icon: "🪰", label: "Karasinek İlaçlama" },
  { icon: "🪱", label: "Bit İlaçlama" },
  { icon: "🕷️", label: "Kene İlaçlama" },
  { icon: "🏨", label: "Otel İlaçlama" },
  { icon: "🏢", label: "İşyeri İlaçlama" },
];

export default function PestMarquee() {
  const track = [...PEST_ITEMS, ...PEST_ITEMS];

  return (
    <div className="w-full overflow-hidden border-y border-emerald-100 bg-emerald-50 py-3">
      <div className="flex w-max animate-marquee items-center">
        {track.map((item, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap px-4 text-sm font-semibold text-emerald-800 sm:text-base"
          >
            <span className="mr-2 text-lg">{item.icon}</span>
            {item.label}
            <span className="ml-4 text-emerald-300">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
