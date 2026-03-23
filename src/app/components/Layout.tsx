import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Idea Starter", href: "/ideas" },
    { name: "Get Estimate", href: "/estimate" },
    { name: "Track Project", href: "/track" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      {/* Header */}
      <header className="bg-[#F9F8F6] border-b border-[#E6DDD5] sticky top-0 z-50 shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C9B59C] to-[#D9CFC7] rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-[#4F4338] font-bold text-xl">PY</span>
                </div>
                <span className="font-bold text-xl text-gray-900">
                  Pydesignhk
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors ${
                    isActive(item.href)
                      ? "text-blue-600 font-medium"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="flex items-center gap-4">
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className={`transition-colors ${
                        isActive("/admin")
                          ? "text-blue-600 font-medium"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {user ? (
                  <>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          isActive("/admin")
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <div className="px-4 py-2 bg-gray-100 rounded-lg">
                      <span className="text-sm text-gray-700">{user.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#EFE9E3] text-[#4F4338] mt-auto border-t border-[#E6DDD5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C9B59C] to-[#D9CFC7] rounded-lg flex items-center justify-center">
                  <span className="text-[#4F4338] font-bold text-xl">PY</span>
                </div>
                <span className="font-bold text-xl">Pydesignhk</span>
              </div>
              <p className="text-[#7A6751] mb-4">
                Transparent renovation starts here. Get accurate estimates and
                track your project in real-time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                    className="text-[#7A6751] hover:text-[#4F4338] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-[#7A6751]">
                <li>Email: info@pydesignhk.com</li>
                <li>Phone: +852 1234 5678</li>
                <li>Hong Kong</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#D9CFC7] mt-8 pt-8 text-center text-[#7A6751]">
            <p>
              &copy; {new Date().getFullYear()} Pydesignhk. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
