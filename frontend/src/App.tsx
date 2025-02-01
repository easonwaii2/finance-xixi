import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LoanProducts from "./pages/LoanProducts";
import Enterprises from "./pages/Enterprises";
import Applications from "./pages/Applications";
import Approvals from "./pages/Approvals";
import Repayments from "./pages/Repayments";
import Sales from "./pages/Sales";
import Commissions from "./pages/Commissions";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <main className="container mx-auto px-4 py-6">
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route
                            path="/loan-products/*"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "business"]}>
                                <LoanProducts />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/enterprises/*" element={<Enterprises />} />
                          <Route path="/applications/*" element={<Applications />} />
                          <Route
                            path="/approvals/*"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "approver"]}>
                                <Approvals />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/repayments/*"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                                <Repayments />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/sales/*"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "business"]}>
                                <Sales />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/commissions/*"
                            element={
                              <ProtectedRoute allowedRoles={["admin", "finance"]}>
                                <Commissions />
                              </ProtectedRoute>
                            }
                          />
                        </Routes>
                      </main>
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
