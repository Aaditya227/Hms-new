




import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Search } from "../lib/icons";
import { DataTable } from "../components/common/DataTable";
import { Button } from "../components/common/Button";
import base_url from "../utils/baseurl";

export function LocationTracker() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base_url}/locationtracker`);
      setLocations(res.data.locations || []);
    } catch (err) {
      console.error("Error fetching locations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const filteredLocations = locations.filter(
    (l) =>
      l.user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.beacon.floor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.beacon.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.beacon.zoneName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center py-8 text-gray-500">Loading staff locations...</p>;

  // Stats
  const totalStaff = locations.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Location Tracker</h1>
          <p className="text-gray-600 mt-1">View staff locations and floors in real-time</p>
        </div>
        <Button onClick={fetchLocations}>Refresh Locations</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalStaff}</p>
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
              placeholder="Search by staff name, role, floor, building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredLocations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No staff location records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filteredLocations}
              columns={[
                { header: "Staff Name", accessor: (r) => `${r.user.firstName} ${r.user.lastName}` },
                { header: "Role", accessor: (r) => r.user.role },
                { header: "Building", accessor: (r) => r.beacon.building || "-" },
                { header: "Floor", accessor: (r) => r.beacon.floor || "-" },
                { header: "Zone", accessor: (r) => r.beacon.zoneName || "-" },
                { header: "Last Seen", accessor: (r) => new Date(r.lastSeen).toLocaleString() },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
