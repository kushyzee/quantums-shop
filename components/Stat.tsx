import { orbitron } from "@/app/layout";

interface StatProps {
  title: string;
  value: string;
}

export default function Stat({ title, value }: StatProps) {
  return (
    <div className="flex flex-col gap-0.5 items-center">
      <p className={`${orbitron.className} text-2xl font-bold text-primary`}>
        {title}
      </p>
      <p className="text-muted-foreground text-sm">{value}</p>
    </div>
  );
}
