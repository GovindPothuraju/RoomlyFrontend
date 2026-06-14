import { Link } from "react-router-dom";
import logo from "../../src/assets/logo.png";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#F8FAFC]/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="RoomLY"
            className="h-20 w-auto object-contain"
          />
        </Link>

        <Link
          to="/login"
          className="
          px-8 py-2
          rounded-full
          border border-cyan-500
          text-cyan-500
          text-sm
          font-medium
          transition-all duration-300
          hover:bg-cyan-500
          hover:text-white
          hover:shadow-lg
          hover:shadow-cyan-500/30
          "
        >
          Login
        </Link>
      </div>
    </header>
  );
}