import {
  ArrowRight,
  Camera,
  Clock3,
  Globe,
  Heart,
  Leaf,
  Package,
  Star,
  Timer,
  Zap,
} from "lucide-react";

const iconMap = {
  leaf: Leaf,
  zap: Zap,
  clock3: Clock3,
  package: Package,
  heart: Heart,
  arrowRight: ArrowRight,
  star: Star,
  timer: Timer,
  globe: Globe,
  camera: Camera,
};

export default function LucideIcon({ name, ...props }) {
  const Icon = iconMap[name];

  if (!Icon) {
    return null;
  }

  return <Icon aria-hidden {...props} />;
}