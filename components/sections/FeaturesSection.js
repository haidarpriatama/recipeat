import SectionHeading from "@/components/ui/SectionHeading";
import LucideIcon from "@/components/ui/LucideIcon";

function TimeCard({ card }) {
  return (
    <div className="group flex flex-col justify-between rounded-[2.5rem] bg-white p-10 transition-all hover:shadow-2xl hover:shadow-[#006941]/5 md:col-span-3">
      <div>
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7bfeb8] transition-transform group-hover:scale-110">
          <LucideIcon className="h-8 w-8 text-[#006941]" name={card.icon} strokeWidth={2.25} />
        </div>
        <h3 className="mb-3 text-2xl font-bold">{card.title}</h3>
        <p className="font-medium text-[#595c5d]">{card.description}</p>
      </div>
    </div>
  );
}

function WasteCard({ card }) {
  return (
    <div
      id="groceries"
      className="group relative flex flex-col justify-center overflow-hidden rounded-[2.5rem] bg-[#006941] p-10 text-white md:col-span-3"
    >
      <div className="relative z-10">
        <LucideIcon className="mb-6 block h-12 w-12" name={card.icon} strokeWidth={2.25} />
        <h3 className="mb-4 text-3xl font-bold">{card.title}</h3>
        <p className="text-lg leading-relaxed text-[#caffdc]/80">{card.description}</p>
      </div>
      <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#7bfeb8]/10 blur-3xl"></div>
    </div>
  );
}

function HealthCard({ card }) {
  return (
    <div className="flex items-center gap-8 rounded-[2.5rem] bg-[#ffc69a] p-10 md:col-span-4">
      <div className="flex-1">
        <h3 className="mb-3 text-2xl font-bold text-[#6f3a00]">{card.title}</h3>
        <p className="font-medium text-[#6f3a00]/80">{card.description}</p>
      </div>
      <div className="flex h-40 w-40 items-center justify-center rounded-full border border-white/20 bg-white/30 backdrop-blur-md">
        <LucideIcon className="h-14 w-14 text-[#8c4a00]" name={card.icon} strokeWidth={2.25} />
      </div>
    </div>
  );
}

function CommunityCard({ card }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-[#dadddf] p-10 text-center md:col-span-2">
      <div className="mb-2 text-4xl font-black text-[#006941]">{card.value}</div>
      <div className="text-sm font-bold uppercase tracking-widest opacity-60">
        {card.label}
      </div>
    </div>
  );
}

export default function FeaturesSection({ title, description, cards }) {
  const timeCard = cards.find((card) => card.variant === "time");
  const wasteCard = cards.find((card) => card.variant === "waste");
  const healthCard = cards.find((card) => card.variant === "health");
  const communityCard = cards.find((card) => card.variant === "community");

  return (
    <section id="meal-planner" className="bg-[#eff1f2] py-24">
      <div className="mx-auto max-w-7xl px-8">
        <SectionHeading
          align="center"
          className="mb-16 space-y-4"
          title={title}
          description={description}
        />

        <div className="grid h-auto grid-cols-1 gap-6 md:h-[600px] md:grid-cols-6 md:grid-rows-2">
          {timeCard ? <TimeCard card={timeCard} /> : null}
          {wasteCard ? <WasteCard card={wasteCard} /> : null}
          {healthCard ? <HealthCard card={healthCard} /> : null}
          {communityCard ? <CommunityCard card={communityCard} /> : null}
        </div>
      </div>
    </section>
  );
}