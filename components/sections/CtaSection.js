import ActionLink from "@/components/ui/ActionLink";

export default function CtaSection({ title, description, action, note }) {
  return (
    <section id="about" className="bg-[#005c38] py-16 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-8 md:flex-row">
        <div className="max-w-2xl text-center md:text-left">
          <h2 className="mb-4 text-3xl font-black">{title}</h2>
          <p className="text-lg text-[#caffdc]/70">{description}</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <ActionLink href={action.href} variant="accent" size="lg">
            {action.label}
          </ActionLink>
          <p className="text-sm font-medium text-[#caffdc]/50">{note}</p>
        </div>
      </div>
    </section>
  );
}