import Image from "next/image";

import ActionLink from "@/components/ui/ActionLink";
import LucideIcon from "@/components/ui/LucideIcon";

export default function HeroSection({
  title,
  description,
  primaryAction,
  secondaryAction,
  heroImage,
}) {
  return (
    <section className="relative flex min-h-[870px] items-center overflow-hidden bg-[#f5f6f7]">
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-8 lg:grid-cols-2">
        <div className="space-y-8 -mt-12 lg:-mt-24">
          <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tighter md:text-7xl">
            {title.lead} <span className="text-[#006941]">{title.highlight}</span>
          </h1>

          <p className="max-w-lg text-xl font-medium leading-relaxed text-[#595c5d]">
            {description}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <ActionLink href={primaryAction.href} variant="primary" size="md">
              {primaryAction.label}
            </ActionLink>

            <ActionLink href={secondaryAction.href} variant="secondary" size="md">
              {secondaryAction.label}
            </ActionLink>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] rotate-2 overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-700 hover:rotate-0">
            <Image
              className="h-full w-full object-cover"
              alt={heroImage.alt}
              src={heroImage.src}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
            />
          </div>

        </div>
      </div>

      <div className="absolute top-0 right-0 -z-0 h-full w-1/3 bg-gradient-to-l from-[#7bfeb8]/20 to-transparent"></div>
    </section>
  );
}