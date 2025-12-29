import { ratesTicker } from "@/lib/config";
import { Circle } from "lucide-react";
export default function RatesCarousel() {
  return (
    <div className="bg-muted border-t border-b border-primary/50 overflow-hidden p-4">
      <div className="flex relative">
        <div className="absolute left-0 top-0 z-10 bottom-0 w-10 bg-gradient-to-r from-muted to-transparent"></div>
        <div className="absolute right-0 top-0 z-10 bottom-0 w-10 bg-gradient-to-l from-muted to-transparent"></div>

        <div className="overflow-hidden flex">
          <div className="flex gap-12 animate-scroll items-center">
            {[...ratesTicker, ...ratesTicker, ...ratesTicker].map((rate) => {
              const Icon = rate.icon;

              return (
                <div
                  key={rate.id}
                  className="flex justify-center items-center gap-12 shrink-0"
                >
                  <div className="flex justify-center items-center gap-2 w-full">
                    <Icon className="w-6 h-6 text-primary" />
                    <p className="w-full">{rate.name}</p>
                  </div>
                  <Circle className="w-2 h-2 bg-white rounded-full" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
