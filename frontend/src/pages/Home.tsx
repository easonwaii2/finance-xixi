import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Home() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <ul className="space-y-2">
            <li>
              <a href="/loan-products" className="text-blue-600 hover:underline">
                View Loan Products
              </a>
            </li>
            <li>
              <a href="/applications" className="text-blue-600 hover:underline">
                Manage Applications
              </a>
            </li>
            <li>
              <a href="/approvals" className="text-blue-600 hover:underline">
                Review Approvals
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
