import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/6 backdrop-blur-md border-b border-white/8">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
          TM
        </div>

        <div>
          <Link to="/" className="text-xl font-semibold">
            TaskManage
          </Link>
          <div className="text-xs text-white/70">Organize. Ship. Repeat.</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="text-sm text-white/90 px-3 py-1 bg-white/6 rounded-md">
              {user.username}
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-sm font-medium transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-sm font-medium">
              Login
            </Link>
            <Link to="/register" className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-sm font-medium">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
