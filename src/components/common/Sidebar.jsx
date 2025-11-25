import React from "react";
import { NavLink } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Sidebar({ items, currentRole, isOpen, onClose }) {
  const { logout } = useAuth();

  // 🔥 FIX: always compare uppercase
  const filteredItems = items.filter((item) =>
    item.roles.map(r => r.toUpperCase()).includes(currentRole)
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-md border-r border-gray-200 z-30 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h1 className="font-bold text-lg">HMS</h1>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-80px)] overflow-y-auto pb-20">
          <nav className="px-3 py-4 space-y-1">
            {filteredItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-hospital-purple text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
