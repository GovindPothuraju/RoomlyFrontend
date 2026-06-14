import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#020C2B] text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-12">

          {/* Logo */}
          <div>
            <img
              src={logo}
              alt="RoomLY"
              className="h-10"
            />

            <p className="mt-5 text-slate-400">
              Smarter meetings powered by AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-5">
              Product
            </h4>

            <ul className="space-y-3 text-slate-400">
              <li><a href="#">Meeting Rooms</a></li>
              <li><a href="#">Scheduler</a></li>
              <li><a href="#">Meeting Notes</a></li>
              <li><a href="#">AI Summary</a></li>
              <li><a href="#">AI Assistant</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-5">
              Company
            </h4>

            <ul className="space-y-3 text-slate-400">
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-5">
              Resources
            </h4>

            <ul className="space-y-3 text-slate-400">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms Of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
            mt-16
            pt-8
            border-t
            border-slate-800
            flex
            flex-col
            md:flex-row
            justify-between
            gap-4
          "
        >
          <p className="text-slate-500">
            © 2025 RoomLY. All Rights Reserved.
          </p>

          <p className="text-slate-500">
            Made for modern teams.
          </p>
        </div>
      </div>
    </footer>
  );
}