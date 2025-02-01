import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
        : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg"
    }`;

  return (
    <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl border-b border-gray-200/80 dark:border-gray-700/80 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <span className="text-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 p-2 rounded-lg shadow-sm">💰</span>
              <span className="hidden sm:inline font-bold">企业贷款系统</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 ml-10">
              <NavLink to="/loan-products" className={navLinkClass}>
                <span className="flex items-center space-x-2">
                  <span className="text-lg">📋</span>
                  <span>贷款产品</span>
                </span>
              </NavLink>
              <NavLink to="/enterprises" className={navLinkClass}>
                <span className="flex items-center space-x-2">
                  <span className="text-lg">🏢</span>
                  <span>企业管理</span>
                </span>
              </NavLink>
              <NavLink to="/applications" className={navLinkClass}>
                <span className="flex items-center space-x-2">
                  <span className="text-lg">📝</span>
                  <span>贷款申请</span>
                </span>
              </NavLink>
              {user?.role === "approver" && (
                <NavLink to="/approvals" className={navLinkClass}>审批管理</NavLink>
              )}
              {user?.role === "finance" && (
                <>
                  <NavLink to="/repayments" className={navLinkClass}>还款管理</NavLink>
                  <NavLink to="/commissions" className={navLinkClass}>佣金管理</NavLink>
                </>
              )}
              {user?.role === "business" && (
                <NavLink to="/sales" className={navLinkClass}>销售管理</NavLink>
              )}
            </div>
          </div>

          {/* Right side: User info, theme toggle, logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-blue-900/30 rounded-lg border border-blue-200/80 dark:border-blue-800/80 shadow-sm transition-all duration-300 hover:shadow-md">
              <span className="text-gray-700 dark:text-gray-200 font-medium">{user?.username}</span>
              <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500/15 to-blue-600/15 dark:from-blue-400/15 dark:to-blue-300/15 text-blue-700 dark:text-blue-300 rounded-full border border-blue-300/50 dark:border-blue-700/50 shadow-inner">
                {user?.role === 'admin' && '管理员'}
                {user?.role === 'business' && '业务员'}
                {user?.role === 'approver' && '审批人员'}
                {user?.role === 'finance' && '财务人员'}
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all transform hover:scale-105 border border-gray-200/80 dark:border-gray-600/80 shadow-sm hover:shadow-md"
              aria-label={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
              title={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
            >
              <span className="text-lg transition-all duration-300 inline-block transform hover:rotate-12">
                {theme === "light" ? "🌙" : "☀️"}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white hover:bg-red-600 dark:hover:bg-red-500 border-2 border-red-600 dark:border-red-500 rounded-lg transition-all duration-200"
            >
              退出登录
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{isMenuOpen ? "关闭菜单" : "打开菜单"}</span>
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-all duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white dark:bg-gray-800 shadow-2xl transform transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</span>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {user?.role === 'admin' && '管理员'}
              {user?.role === 'business' && '业务员'}
              {user?.role === 'approver' && '审批人员'}
              {user?.role === 'finance' && '财务人员'}
            </span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="关闭菜单"
          >
            <svg
              className="h-5 w-5 text-gray-600 dark:text-gray-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-2 py-4 space-y-1">
          <NavLink
            to="/loan-products"
            className={navLinkClass}
            onClick={() => setIsMenuOpen(false)}
          >
            贷款产品
          </NavLink>
          <NavLink
            to="/enterprises"
            className={navLinkClass}
            onClick={() => setIsMenuOpen(false)}
          >
            企业管理
          </NavLink>
          <NavLink
            to="/applications"
            className={navLinkClass}
            onClick={() => setIsMenuOpen(false)}
          >
            贷款申请
          </NavLink>
          {user?.role === "approver" && (
            <NavLink
              to="/approvals"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              审批管理
            </NavLink>
          )}
          {user?.role === "finance" && (
            <>
              <NavLink
                to="/repayments"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                还款管理
              </NavLink>
              <NavLink
                to="/commissions"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                佣金管理
              </NavLink>
            </>
          )}
          {user?.role === "business" && (
            <NavLink
              to="/sales"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              销售管理
            </NavLink>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>
    </nav>
  );
}
