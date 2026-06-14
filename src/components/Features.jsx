import {
  Video,
  Calendar,
  Clock3,
  FileText,
  Sparkles,
  Bot,
  ArrowRight,
} from "lucide-react";

import rooms from "../assets/feature-rooms.png";
import schedule from "../assets/feature-schedule.png";
import scheduler from "../assets/feature-scheduler.png";
import notes from "../assets/feature-notes.png";
import summary from "../assets/feature-summary.png";
import assistant from "../assets/feature-assistant.png";

const features = [
  {
    id: "01",
    icon: Video,
    title: "Meeting Rooms",
    description:
      "Create secure, high-quality virtual rooms instantly and connect teams from anywhere.",
    image: rooms,
  },
  {
    id: "02",
    icon: Calendar,
    title: "Schedule Meetings",
    description:
      "Plan meetings in seconds with smart scheduling tools and calendar integrations.",
    image: schedule,
  },
  {
    id: "03",
    icon: Clock3,
    title: "Meet Scheduler",
    description:
      "Automatically find the perfect time across teams and multiple time zones.",
    image: scheduler,
  },
  {
    id: "04",
    icon: FileText,
    title: "Meeting Notes",
    description:
      "Capture discussions and action items automatically.",
    image: notes,
  },
  {
    id: "05",
    icon: Sparkles,
    title: "AI Meeting Summary",
    description:
      "Receive concise AI-generated summaries instantly.",
    image: summary,
  },
  {
    id: "06",
    icon: Bot,
    title: "AI Meeting Assistant",
    description:
      "Get recommendations, reminders and insights in real time.",
    image: assistant,
  },
];

export default function Features() {
  return (
    <section className="py-32 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-28">
          <div className="inline-flex items-center rounded-full border border-cyan-200 px-4 py-1 text-xs font-semibold text-cyan-500 uppercase tracking-wider">
            Features
          </div>

          <h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight text-slate-900">
            Everything Your Team Needs{" "}
            <span className="text-cyan-400">
              In One Place
            </span>
          </h2>

          <p className="mt-6 text-slate-500 text-lg">
            RoomLY combines meetings, scheduling, AI summaries,
            notes, and intelligent assistance into one seamless platform.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-36">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const reverse = index % 2 !== 0;

            return (
              <div
                key={feature.id}
                className={`
                  grid
                  lg:grid-cols-2
                  gap-16
                  items-center
                  ${reverse ? "lg:[&>*:first-child]:order-2" : ""}
                `}
              >
                {/* Content */}
                <div className="max-w-md">
                  <div className="h-14 w-14 rounded-2xl bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-400/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-cyan-500">
                    {feature.id} / Feature
                  </p>

                  <h3 className="mt-3 text-4xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>

                  <button
                    className="
                      mt-6
                      inline-flex
                      items-center
                      gap-2
                      text-cyan-500
                      font-semibold
                      hover:gap-3
                      transition-all
                    "
                  >
                    Learn More
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Image */}
                <div className="relative">
                  <div
                    className="
                      absolute
                      inset-0
                      bg-cyan-400/10
                      blur-3xl
                      rounded-full
                    "
                  />

                  <div
                    className="
                      relative
                      bg-white
                      rounded-3xl
                      border
                      border-slate-200
                      shadow-xl
                      overflow-hidden
                      transition-all
                      duration-500
                      hover:-translate-y-2
                      hover:shadow-cyan-500/20
                    "
                  >
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        hover:scale-105
                      "
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}