
// // 1
// import React from "react";
// import { NavLink } from "react-router-dom";
// import { X, LogOut } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// // import logo from "../assets/logo.png";

// export function Sidebar({ items, currentRole, isOpen, onClose }) {
//   const { logout } = useAuth();
//   const filteredItems = items.filter((item) => item.roles.includes(currentRole));

//   return (
//     <>
//       {/* Overlay for mobile (click to close) */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
//           onClick={onClose}
//         ></div>
//       )}

//       {/* Sidebar container */}
//       <aside
//         className={`fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out
//           ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
//       >
//         {/* Header / Logo Section */}
//         <div className="p-6 flex justify-between items-center border-b border-gray-200">
        
//           {/* <div>//=====================================mukul removed this line========================================
//             <img src={logo} alt="Hospital Logo" className="w-30 h-30" />
//           </div> */}

// <div><h1>HMS</h1></div>
//           {/* Close Button (Mobile only) */}
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Navigation Links */}
//         <nav className="px-3 py-4 space-y-1 overflow-y-auto">
//           {filteredItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               onClick={onClose} // close sidebar on mobile when link clicked
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//                   isActive
//                     ? "bg-hospital-purple text-white shadow-md"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`
//               }
//             >
//               <item.icon className="w-5 h-5" />
//               <span className="font-medium">{item.label}</span>
//             </NavLink>
//           ))}
//         </nav>

//         {/* ✅ Logout button at bottom (only mobile) */}
//         <div className="absolute bottom-4 left-0 w-full px-4 md:hidden">
//           <button
//             onClick={() => {
//               logout();
//               onClose();
//             }}
//             className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-hospital-purple text-white font-medium hover:bg-hospital-purple/90 transition-colors"
//           >
//             <LogOut className="w-5 h-5" />
//             Logout
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }


// 2


import React from "react";
import { NavLink } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Sidebar({ items, currentRole, isOpen, onClose }) {
  const { logout } = useAuth();
  const filteredItems = items.filter((item) => item.roles.includes(currentRole));

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-md border-r border-gray-200 z-30 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h1 className="font-bold text-lg">HMS</h1>

          {/* Close icon (mobile only) */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* ⭐ Scrollable Navigation */}
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


// 3

