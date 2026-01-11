import { orbitron } from "@/app/layout";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  highlightedWord: string;
  subtitle: string;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export default function SectionHeader({
  title,
  highlightedWord,
  subtitle,
  className,
  id,
  children,
}: SectionHeaderProps) {
  return (
    <section className={cn("py-20 lg:py-36 md:px-6 px-5", className)} id={id}>
      <div className="text-center">
        <h2
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold",
            orbitron.className
          )}
        >
          {title} <span className="text-primary">{highlightedWord}</span>
        </h2>
        <p className="text-muted-foreground mt-1.5 lg:text-lg">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
