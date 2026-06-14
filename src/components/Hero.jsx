import {
  Sparkles,
  ArrowRight,
  Play,
  Calendar,
  FileText,
} from "lucide-react";

import heroImage from "../../src/assets/heroImage.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC]">
      
      {/* Background Glow */}
      <div className="absolute left-1/2 top-[500px] -translate-x-1/2 w-[900px] h-[500px] bg-cyan-400/20 blur-[150px]" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">

        {/* Badge */}
        <div className="flex justify-center">
          <div
            className="
            inline-flex items-center gap-2
            px-5 py-2
            rounded-full
            border border-cyan-200
            bg-white
            shadow-sm
            "
          >
            <Sparkles
              size={14}
              className="text-cyan-500"
            />

            <span className="text-sm text-slate-700">
              Trusted by 100+ Teams Worldwide
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="mt-10 text-center">
          <h1
            className="
            text-6xl
            md:text-8xl
            font-extrabold
            leading-none
            tracking-tight
            "
          >
            <span className="text-[#0F172A]">
              Meetings That
            </span>

            <span className="text-cyan-400">
              {" "}Think
            </span>

            <br />

            <span className="text-cyan-400">
              Ahead.
            </span>
          </h1>

          <p
            className="
            max-w-3xl
            mx-auto
            mt-8
            text-lg
            md:text-xl
            text-slate-500
            leading-relaxed
            "
          >
            Host smarter conversations, schedule effortlessly,
            capture every detail automatically, and let AI handle
            the busy work while your team focuses on what truly matters.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            
            <button
              className="
              group
              px-8 py-4
              rounded-full
              bg-cyan-400
              text-white
              font-semibold
              shadow-xl shadow-cyan-500/30
              hover:scale-105
              hover:shadow-cyan-500/50
              transition-all duration-300
              "
            >
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />
              </span>
            </button>

            <button
              className="
              px-8 py-4
              rounded-full
              border border-slate-300
              bg-white
              text-slate-700
              font-semibold
              hover:bg-slate-50
              transition-all
              "
            >
              <span className="flex items-center gap-2">
                <Play size={16} fill="currentColor" />
                Watch Demo
              </span>
            </button>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="relative mt-24 flex justify-center">

          {/* Left Floating Card */}
          <div
            className="
            hidden lg:flex
            absolute
            left-0
            top-24
            items-center
            gap-3
            px-5 py-4
            rounded-2xl
            bg-white/80
            backdrop-blur-xl
            border border-white
            shadow-xl
            "
          >
            <Calendar
              size={18}
              className="text-cyan-500"
            />

            <div>
              <p className="text-xs text-slate-400">
                Next meeting
              </p>

              <p className="font-semibold text-slate-700">
                Sprint review · 2:30 PM
              </p>
            </div>
          </div>

          {/* Right Floating Card */}
          <div
            className="
            hidden lg:flex
            absolute
            right-0
            top-36
            items-center
            gap-3
            px-5 py-4
            rounded-2xl
            bg-white/80
            backdrop-blur-xl
            border border-white
            shadow-xl
            "
          >
            <Sparkles
              size={18}
              className="text-cyan-500"
            />

            <div>
              <p className="text-xs text-slate-400">
                AI Assistant
              </p>

              <p className="font-semibold text-slate-700">
                3 action items captured
              </p>
            </div>
          </div>

          {/* Bottom Floating Card */}
          <div
            className="
            hidden lg:flex
            absolute
            bottom-0
            left-1/4
            translate-y-8
            items-center
            gap-3
            px-5 py-4
            rounded-2xl
            bg-white/80
            backdrop-blur-xl
            border border-white
            shadow-xl
            "
          >
            <FileText
              size={18}
              className="text-cyan-500"
            />

            <div>
              <p className="text-xs text-slate-400">
                Summary ready
              </p>

              <p className="font-semibold text-slate-700">
                Generated in 4 seconds
              </p>
            </div>
          </div>

          {/* Dashboard */}
          <div
            className="
            rounded-[28px]
            overflow-hidden
            bg-[#020617]
            shadow-2xl
            shadow-cyan-500/10
            border border-slate-800
            "
          >
            <img
              src={heroImage}
              alt="RoomLY Dashboard"
              className="
              w-full
              max-w-5xl
              object-cover
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}