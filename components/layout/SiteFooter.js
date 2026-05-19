import LucideIcon from "@/components/ui/LucideIcon";

export default function SiteFooter({
  brand,
  legalText,
  socialItems,
  linkGroups,
}) {
  return (
    <footer className="w-full rounded-t-[2rem] bg-[#eff1f2]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-12 py-16 md:grid-cols-2">
        <div className="space-y-6">
          <div className="text-lg font-bold text-[#006941]">{brand}</div>
          <p className="max-w-sm text-xs font-medium uppercase tracking-widest text-slate-500">
            {legalText}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {linkGroups.map((group) => (
            <div key={group.title} className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-[#2c2f30]">
                {group.title}
              </div>

              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="text-xs font-medium uppercase tracking-widest text-slate-500 transition-colors hover:text-[#006941]"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}