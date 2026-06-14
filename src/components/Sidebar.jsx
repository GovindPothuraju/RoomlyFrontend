import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  Video,
  CalendarDays,
  PenTool,
  Sparkles,
  FileText,
  Bot,
  PlayCircle,
  Users,
  Settings,
  Menu,
  X,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";

const menuItems = [
  {
    name: "Meetings",
    icon: Video,
    path: "/home/meetings",
  },
  {
    name: "Schedule Meeting",
    icon: CalendarDays,
    path: "/home/schedule",
  },
  {
    name: "Whiteboard",
    icon: PenTool,
    path: "/home/whiteboard",
  },
  {
    name: "AI Summary",
    icon: Sparkles,
    path: "/home/summary",
  },
  {
    name: "Meeting Notes",
    icon: FileText,
    path: "/home/notes",
  },
  {
    name: "AI Assistant",
    icon: Bot,
    path: "/home/assistant",
  },
  {
    name: "Recordings",
    icon: PlayCircle,
    path: "/home/recordings",
  },
  {
    name: "Workspace",
    icon: Users,
    path: "/home/workspace",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/home/analytics",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/home/settings",
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div
        className="
        lg:hidden
        fixed
        top-0
        left-0
        right-0
        h-16
        bg-white
        border-b
        border-slate-200
        flex
        items-center
        justify-between
        px-4
        z-40
      "
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="
            p-2
            rounded-lg
            hover:bg-slate-100
            transition
          "
          >
            <Menu size={22} />
          </button>

          <h1 className="text-xl font-bold">
            Room
            <span className="text-cyan-500">
              LY
            </span>
          </h1>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
          fixed
          inset-0
          bg-black/40
          backdrop-blur-sm
          z-40
          lg:hidden
        "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:relative
        top-0
        left-0

        h-screen
        w-72

        bg-white
        border-r
        border-slate-200

        flex
        flex-col

        z-50

        transition-transform
        duration-300

        ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        {/* Header */}
        <div
          className="
          h-20
          border-b
          border-slate-200

          flex
          items-center
          justify-between

          px-6
        "
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard
              className="text-cyan-500"
              size={24}
            />

            <h1 className="text-2xl font-bold">
              Room
              <span className="text-cyan-500">
                LY
              </span>
            </h1>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="
            lg:hidden
            p-2
            rounded-lg
            hover:bg-slate-100
          "
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div
          className="
          flex-1
          overflow-y-auto
          py-6
          px-4
        "
        >
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex
                    items-center
                    gap-3

                    px-4
                    py-3

                    rounded-xl

                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-cyan-500 text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-100"
                    }
                  `
                  }
                >
                  <Icon size={20} />

                  <span className="font-medium">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Card */}
        <div className="p-4 border-t border-slate-200">
          <div
            className="
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-cyan-600

            text-white

            p-4
          "
          >
            <h3 className="font-semibold">
              RoomLY AI
            </h3>

            <p className="text-sm text-cyan-100 mt-1">
              Smart meetings powered by AI.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;