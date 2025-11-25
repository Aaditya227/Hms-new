

// // 3
// import React, { useState } from "react";
// import { Search, User, LogOut, Menu, X } from "../../lib/icons";
// import { useAuth } from "../../context/AuthContext";
// //import logo from "../assets/logo.png";//mukul removed this line

// export function TopBar({ onToggleSidebar }) {
//   const { user, logout } = useAuth();
//   const [showSearch, setShowSearch] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);

//   return (
//     <header className="bg-white/70 backdrop-blur-md border-gray-200 fixed top-0 left-0 right-0 md:left-64 h-10 transition-all">
//       {/* ======= MOBILE HEADER ======= */}
//       <div className="sm:hidden flex items-center justify-between px-4 pt-2 pb-1 border-b border-gray-100">
//         {/* Menu Button */}
//         <button
//           onClick={onToggleSidebar}
//           className="flex items-center gap-2 px-3 py-2 rounded-lg bg-hospital-purple/10 text-hospital-purple hover:bg-hospital-purple/20 transition"
//         >
//           <Menu className="w-5 h-5" />
//           <span className="text-sm font-medium">Menu</span>
//         </button>

//         {/* Right: Search & Profile Icons */}
//         <div className="flex items-center gap-3">
//           <button
//             className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
//             onClick={() => setShowSearch((p) => !p)}
//           >
//             {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
//           </button>

//           {/* ✅ Only visible on mobile */}
//           <button
//             className="p-2 bg-hospital-purple/10 rounded-lg text-hospital-purple hover:bg-hospital-purple/20 transition-colors sm:hidden"
//             onClick={() => setShowProfile((p) => !p)}
//           >
//             <User className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* ======= DESKTOP TOPBAR ======= */}
//       <div className="h-14 px-4 md:px-6 flex items-center justify-between">
//         {/* --- LEFT: Search Bar --- */}
//         <div className="flex items-center gap-3">
//           <div className="hidden sm:block w-64 md:w-96">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search patients, staff, appointments..."
//                 className="w-full pl-10 pr-4 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>

//         {/* --- RIGHT: Profile Icon (Desktop only) --- */}
//         <div className="hidden sm:flex items-center gap-3 sm:gap-4 relative">
//           <button
//             className="p-2 bg-hospital-purple/10 rounded-lg text-hospital-purple hover:bg-hospital-purple/20 transition"
//             onClick={() => setShowProfile((p) => !p)}
//           >
//             <User className="w-5 h-5" />
//           </button>

//           {/* Profile Dropdown */}
//           {showProfile && (
//             <div
//               className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex flex-col z-40"
//               onMouseLeave={() => setShowProfile(false)}
//             >
//               <div className="px-3 py-2 border-b border-gray-200">
//                 <p className="text-sm font-medium text-gray-900">{user?.email}</p>
//                 <p className="text-xs text-gray-600">{user?.role}</p>
//               </div>
//               <button
//                 onClick={logout}
//                 className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
//               >
//                 <LogOut className="w-4 h-4 text-gray-600" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ======= MOBILE SEARCH BAR ======= */}
//       {showSearch && (
//         <div className="sm:hidden bg-white border-t border-gray-200 px-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search patients, staff, appointments..."
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//             />
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }


// 4

// import React, { useState } from "react";
// import { Search, User, LogOut, Menu, X } from "../../lib/icons";
// import { useAuth } from "../../context/AuthContext";

// export function TopBar({ onToggleSidebar }) {
//   const { user, logout } = useAuth();
//   const [showSearch, setShowSearch] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);

//   return (
//     <header className="bg-white/70 backdrop-blur-md border-gray-200 fixed top-0 left-0 right-0 md:left-64 h-auto z-40">

//       {/* ===== MOBILE TOP BAR ===== */}
//       <div className="sm:hidden flex items-center justify-between px-4 pt-2 pb-2 border-b border-gray-200">
        
//         {/* Sidebar Toggle Button */}
//         <button
//           onClick={onToggleSidebar}
//           className="flex items-center gap-2 px-3 py-2 rounded-lg bg-hospital-purple/10 text-hospital-purple hover:bg-hospital-purple/20 transition"
//         >
//           <Menu className="w-5 h-5" />
//           <span className="text-sm font-medium">Menu</span>
//         </button>

//         {/* Right Icons */}
//         <div className="flex items-center gap-3">

//           {/* Mobile Search Toggle */}
//           <button
//             className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
//             onClick={() => setShowSearch((p) => !p)}
//           >
//             {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
//           </button>

//           {/* Mobile Profile Toggle */}
//           <button
//             className="p-2 bg-hospital-purple/10 rounded-lg text-hospital-purple hover:bg-hospital-purple/20 transition"
//             onClick={() => setShowProfile((p) => !p)}
//           >
//             <User className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* ===== DESKTOP TOP BAR ===== */}
//       <div className="hidden sm:flex items-center justify-between h-14 px-4 md:px-6 border-b border-gray-100">
        
//         {/* Search Bar */}
//         <div className="w-72 md:w-96">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search patients, staff, appointments..."
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-hospital-purple"
//             />
//           </div>
//         </div>

//         {/* Desktop Profile */}
//         <div className="relative">
//           <button
//             className="p-2 bg-hospital-purple/10 rounded-lg text-hospital-purple hover:bg-hospital-purple/20 transition"
//             onClick={() => setShowProfile((p) => !p)}
//           >
//             <User className="w-5 h-5" />
//           </button>

//           {/* Desktop Profile Popup */}
//           {showProfile && (
//             <div
//               className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50"
//               onMouseLeave={() => setShowProfile(false)}
//             >
//               <div className="px-3 py-2 border-b border-gray-200">
//                 <p className="text-sm font-medium text-gray-900">{user?.email}</p>
//                 <p className="text-xs text-gray-600">{user?.role}</p>
//               </div>
//               <button
//                 onClick={logout}
//                 className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
//               >
//                 <LogOut className="w-4 h-4 text-gray-600" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ===== MOBILE SEARCH BOX ===== */}
//       {showSearch && (
//         <div className="sm:hidden bg-white border-t border-gray-200 px-4 py-2">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search patients, staff, appointments..."
//               className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-hospital-purple"
//             />
//           </div>
//         </div>
//       )}

//       {/* ===== MOBILE PROFILE DROPDOWN ===== */}
//       {showProfile && (
//         <div className="sm:hidden bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
//           <p className="text-sm font-medium text-gray-900">{user?.email}</p>
//           <p className="text-xs text-gray-600 mb-2">{user?.role}</p>

//           <button
//             onClick={logout}
//             className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition w-full"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       )}
//     </header>
//   );
// }


// 5

import React, { useState } from "react";
import { Search, User, LogOut, Menu, X } from "../../lib/icons";
import { useAuth } from "../../context/AuthContext";

export function TopBar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="bg-white/70 backdrop-blur-md border-gray-200 fixed top-0 left-0 right-0 md:left-64 z-40">

      {/* ==== MOBILE HEADER ==== */}
      <div className="sm:hidden flex items-center justify-between px-4 pt-2 pb-2 border-b border-gray-200">
        
        {/* Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-hospital-purple/10 text-hospital-purple hover:bg-hospital-purple/20 transition"
        >
          <Menu className="w-5 h-5" />
          <span className="text-sm font-medium">Menu</span>
        </button>

        {/* Right icon buttons */}
        <div className="flex items-center gap-3">

          {/* Search toggle */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            onClick={() => setShowSearch((p) => !p)}
          >
            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* Profile toggle */}
          <button
            className="p-2 bg-hospital-purple/10 rounded-lg text-hospital-purple hover:bg-hospital-purple/20 transition"
            onClick={() => setShowProfile((p) => !p)}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ==== DESKTOP HEADER ==== */}
      <div className="hidden sm:flex items-center justify-between h-14 px-4 md:px-6 border-b border-gray-100">
        
        {/* Search */}
        <div className="w-72 md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, staff, appointments..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-hospital-purple"
            />
          </div>
        </div>

        {/* Desktop Profile */}
        <div className="relative">
          <button
            className="p-2 bg-hospital-purple/10 rounded-lg text-hospital-purple hover:bg-hospital-purple/20 transition"
            onClick={() => setShowProfile((p) => !p)}
          >
            <User className="w-5 h-5" />
          </button>

          {/* Desktop dropdown */}
          {showProfile && (
            <div
              className="absolute right-0 top-12 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50"
              onMouseLeave={() => setShowProfile(false)}
            >
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-600">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==== MOBILE SEARCH ==== */}
      {showSearch && (
        <div className="sm:hidden bg-white border-t border-gray-200 px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, staff, appointments..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-hospital-purple"
            />
          </div>
        </div>
      )}

      {/* ==== MOBILE PROFILE POPUP (Updated & centered) ==== */}
      {showProfile && (
        <div className="sm:hidden relative">
          <div className="absolute right-4 top-2 w-60 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50">

            <div className="px-3 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-600">{user?.role}</p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
