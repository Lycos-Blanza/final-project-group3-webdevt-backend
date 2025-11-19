// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ── PROVIDERS ──────────────────────────────────────────────
import { AuthProvider } from "./contexts/AuthContext";
import { TablesProvider } from "./contexts/TablesContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ReservationProvider } from "./contexts/ReservationContext"; // ← ADDED

// ── COMPONENTS ─────────────────────────────────────────────
import Topbar from "./components/Topbar";
import Footer from "./components/Footer";

// ── PAGES ──────────────────────────────────────────────────
import Homepage from "./pages/Homepage";
import Reservation from "./pages/Reservation";
import CustomerReservations from "./pages/CustomerReservations";
import MyHistory from "./pages/MyHistory";
import MyProfile from "./pages/MyProfile";
import Dashboard from "./pages/Dashboard";
import AdminTables from "./pages/AdminTables";
import Messages from "./pages/Messages";
import ContactUs from "./pages/ContactUs";
import MenuPage from "./pages/MenuPage";        // ← your full menu page
// import Menu from "./components/Menu";       // ← old component (optional)

// ── LAYOUT ─────────────────────────────────────────────────
function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f6f0e7]">
      <Topbar />
      <main className="flex-grow pt-14 pb-16">{children}</main>
      <Footer />
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────
export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <TablesProvider>
          <ReservationProvider>   {/* ← NOW ACTIVE! */}
            <Router>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/reserve" element={<Reservation />} />
                  <Route path="/my-reservations" element={<CustomerReservations />} />
                  <Route path="/my-history" element={<MyHistory />} />
                  <Route path="/profile" element={<MyProfile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin-tables" element={<AdminTables />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/menu" element={<MenuPage />} />   {/* ← only one */}
                </Routes>
              </AppLayout>
            </Router>
          </ReservationProvider>
        </TablesProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}