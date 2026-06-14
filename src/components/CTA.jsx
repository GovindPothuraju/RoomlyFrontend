import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#020C2B] py-32 ">
      {/* Glow Effects */}
      <div className="absolute left-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Ready To Transform The Way
          <br />
          Your Team Meets?
        </h2>

        <p className="mt-6 text-slate-300 text-lg">
          Join hundreds of teams using RoomLY to schedule,
          host, and optimize meetings with AI.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            className="
              px-8 py-4
              rounded-full
              bg-cyan-400
              text-white
              font-semibold
              hover:scale-105
              transition-all
              shadow-lg
              shadow-cyan-500/30
            "
          >
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight size={18} />
            </span>
          </button>

          <button
            className="
              px-8 py-4
              rounded-full
              border
              border-slate-500
              text-white
              hover:bg-white/10
              transition-all
            "
          >
            See Pricing
          </button>
        </div>
      </div>
    </section>
  );
}