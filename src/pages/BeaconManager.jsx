// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Users, Plus, Search, Edit2, Trash2 } from "../lib/icons";
// import { DataTable } from "../components/common/DataTable";
// import { Button } from "../components/common/Button";
// import { Modal } from "../components/common/Modal";

// // Form for Add/Edit Beacon
// function BeaconForm({ beacon, onSuccess }) {
//   const [formData, setFormData] = useState({
//     beaconCode: beacon?.beaconCode || "",
//     zoneName: beacon?.zoneName || "",
//     building: beacon?.building || "",
//     floor: beacon?.floor || "",
//     isActive: beacon?.isActive ?? true,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     onSuccess(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-gray-700 font-medium">Beacon Code</label>
//         <input
//           type="text"
//           name="beaconCode"
//           value={formData.beaconCode}
//           onChange={handleChange}
//           required
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700 font-medium">Zone Name</label>
//         <input
//           type="text"
//           name="zoneName"
//           value={formData.zoneName}
//           onChange={handleChange}
//           required
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700 font-medium">Building</label>
//         <input
//           type="text"
//           name="building"
//           value={formData.building}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>
//       <div>
//         <label className="block text-gray-700 font-medium">Floor</label>
//         <input
//           type="text"
//           name="floor"
//           value={formData.floor}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         />
//       </div>
//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           name="isActive"
//           checked={formData.isActive}
//           onChange={handleChange}
//           className="h-4 w-4"
//         />
//         <label className="text-gray-700 font-medium">Active</label>
//       </div>
//       <Button type="submit">{beacon ? "Update Beacon" : "Add Beacon"}</Button>
//     </form>
//   );
// }

// export function BeaconManager() {
//   const [beacons, setBeacons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedBeacon, setSelectedBeacon] = useState(null);

//   useEffect(() => {
//     fetchBeacons();
//   }, []);

//   const fetchBeacons = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:5000/api/beacon");
//       setBeacons(res.data.beacons || []);
//     } catch (err) {
//       console.error("Error fetching beacons:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBeaconSave = async (formData) => {
//     try {
//       if (selectedBeacon) {
//         await axios.put(`http://localhost:5000/api/beacon/${selectedBeacon.id}`, formData);
//       } else {
//         await axios.post("http://localhost:5000/api/beacon/", formData);
//       }
//       setIsModalOpen(false);
//       setSelectedBeacon(null);
//       await fetchBeacons();
//     } catch (err) {
//       console.error("Error saving beacon:", err);
//     }
//   };

//   const handleDeleteBeacon = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this beacon?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/beacon/${id}`);
//       setBeacons((prev) => prev.filter((b) => b.id !== id));
//     } catch (err) {
//       console.error("Error deleting beacon:", err);
//     }
//   };

//   const filteredBeacons = beacons.filter(
//     (b) =>
//       b.beaconCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       b.zoneName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       b.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       b.floor?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (loading) return <p className="text-center py-8 text-gray-500">Loading beacons...</p>;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3 mt-10">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-gray-900">Beacon Manager</h1>
//           <p className="text-gray-600 mt-1">Manage hospital beacons (floors, zones, and status)</p>
//         </div>
//         <Button
//           icon={Plus}
//           onClick={() => {
//             setSelectedBeacon(null);
//             setIsModalOpen(true);
//           }}
//         >
//           Add New Beacon
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Beacons</p>
//               <p className="text-2xl font-bold text-gray-900 mt-1">{beacons.length}</p>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <Users className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search + Table */}
//       <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
//         <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
//           <div className="w-full sm:w-1/2 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <input
//               type="text"
//               placeholder="Search by code, zone, building, or floor..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>
//         </div>

//         {filteredBeacons.length === 0 ? (
//           <p className="text-gray-500 text-center py-8">No beacons found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <DataTable
//               data={filteredBeacons}
//               columns={[
//                 { header: "Code", accessor: "beaconCode" },
//                 { header: "Zone", accessor: "zoneName" },
//                 { header: "Building", accessor: "building" },
//                 { header: "Floor", accessor: "floor" },
//                 {
//                   header: "Status",
//                   accessor: (b) =>
//                     b.isActive ? (
//                       <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                         Active
//                       </span>
//                     ) : (
//                       <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
//                         Inactive
//                       </span>
//                     ),
//                 },
//                 {
//                   header: "Actions",
//                   accessor: (b) => (
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => {
//                           setSelectedBeacon(b);
//                           setIsModalOpen(true);
//                         }}
//                         className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteBeacon(b.id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ),
//                 },
//               ]}
//             />
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedBeacon(null);
//         }}
//         title={selectedBeacon ? "Edit Beacon" : "Add New Beacon"}
//       >
//         <BeaconForm beacon={selectedBeacon} onSuccess={handleBeaconSave} />
//       </Modal>
//     </div>
//   );
// }



// update


import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Plus, Search, Edit2, Trash2 } from "../lib/icons";
import { DataTable } from "../components/common/DataTable";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import base_url from "../utils/baseurl";

// Form for Add/Edit Beacon
function BeaconForm({ beacon, onSuccess }) {
  const [formData, setFormData] = useState({
    beaconCode: beacon?.beaconCode || "",
    zoneName: beacon?.zoneName || "",
    building: beacon?.building || "",
    floor: beacon?.floor || "",
    isActive: beacon?.isActive ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSuccess(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium">Beacon Code</label>
        <input
          type="text"
          name="beaconCode"
          value={formData.beaconCode}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Zone Name</label>
        <input
          type="text"
          name="zoneName"
          value={formData.zoneName}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Building</label>
        <input
          type="text"
          name="building"
          value={formData.building}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Floor</label>
        <input
          type="text"
          name="floor"
          value={formData.floor}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label className="text-gray-700 font-medium">Active</label>
      </div>
      <Button type="submit">{beacon ? "Update Beacon" : "Add Beacon"}</Button>
    </form>
  );
}

export function BeaconManager() {
  const [beacons, setBeacons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBeacon, setSelectedBeacon] = useState(null);

  useEffect(() => {
    fetchBeacons();
  }, []);

  const fetchBeacons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/beacon`);
      setBeacons(res.data.beacons || []);
    } catch (err) {
      console.error("Error fetching beacons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBeaconSave = async (formData) => {
    try {
      if (selectedBeacon) {
        await axios.put(`${base_url}/beacon/${selectedBeacon.id}`, formData);
      } else {
        await axios.post(`${base_url}/beacon/`, formData);
      }
      setIsModalOpen(false);
      setSelectedBeacon(null);
      await fetchBeacons();
    } catch (err) {
      console.error("Error saving beacon:", err);
    }
  };

  const handleDeleteBeacon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this beacon?")) return;
    try {
      await axios.delete(`${base_url}/beacon/${id}`);
      setBeacons((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Error deleting beacon:", err);
    }
  };

  const filteredBeacons = beacons.filter(
    (b) =>
      b.beaconCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.zoneName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.floor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center py-8 text-gray-500">Loading beacons...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Beacon Manager</h1>
          <p className="text-gray-600 mt-1">Manage hospital beacons (floors, zones, and status)</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            setSelectedBeacon(null);
            setIsModalOpen(true);
          }}
        >
          Add New Beacon
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Beacons</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{beacons.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="w-full sm:w-1/2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by code, zone, building, or floor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredBeacons.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No beacons found.</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filteredBeacons}
              columns={[
                { header: "Code", accessor: "beaconCode" },
                { header: "Zone", accessor: "zoneName" },
                { header: "Building", accessor: "building" },
                { header: "Floor", accessor: "floor" },
                {
                  header: "Status",
                  accessor: (b) =>
                    b.isActive ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        Inactive
                      </span>
                    ),
                },
                {
                  header: "Actions",
                  accessor: (b) => (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedBeacon(b);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBeacon(b.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBeacon(null);
        }}
        title={selectedBeacon ? "Edit Beacon" : "Add New Beacon"}
      >
        <BeaconForm beacon={selectedBeacon} onSuccess={handleBeaconSave} />
      </Modal>
    </div>
  );
}
