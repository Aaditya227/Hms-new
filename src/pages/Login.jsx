// // 1

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { login, loading } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const result = await login(formData.email, formData.password);

//     if (result.success) {
//       const role = result.user.role;
//       // Redirect based on role
//       navigate("/dashboard");
//     } else {
//       setError(result.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-[400px]">
//         <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
//           🏥 Login to Hospital System
//         </h2>

//         {error && (
//           <p className="text-red-600 text-sm text-center mb-3">{error}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-400"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-400"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



// update

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { login, loading } = useAuth();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const result = await login(formData.email, formData.password);

//     if (result.success) {
//       const role = result.user.role;
//       // Redirect based on role
//       navigate("/dashboard");
//     } else {
//       setError(result.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-[400px]">
//         <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
//           🏥 Login to Hospital System
//         </h2>

//         {error && (
//           <p className="text-red-600 text-sm text-center mb-3">{error}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-400"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-400"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



// src/components/Login.js (ya jahan bhi yeh file hai)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // AuthContext import karna bhoolna mat

export default function Login() {
  const { login, loading } = useAuth(); // AuthContext se login aur loading lo
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // SIRF AuthContext ka login function call karo
    const result = await login(formData.email, formData.password);

    if (result.success) {
      const role = result.user.role;
           
      // Role ke according redirect karo
      switch(role) {
        case 'ADMIN':
          navigate("/dashboard");
          break;
        case 'doctor':
          navigate("/dashboard");
          break;
        case 'nurse':
          navigate("/dashboard");
          break;
        case 'patient':
          navigate("/dashboard");
          break;
        case 'receptionist':
          navigate("/dashboard");
          break;
        default:
          navigate("/dashboard"); // Agar role match na kare to default dashboard
      }
    } else {
      // Agar login fail ho to error message set karo
      setError(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[400px]">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          🏥 Login to Hospital System
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading} // AuthContext se aa raha hai loading state
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}