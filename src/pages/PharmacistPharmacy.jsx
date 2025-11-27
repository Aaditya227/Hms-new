import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Plus } from "../lib/icons";
import { Button } from "../components/common/Button";
import base_url from "../utils/baseurl";

const API_URL = `${base_url}/pharmacy`;

export default function PharmacistPharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    brand_name: "",
    generic_name: "",
    strength: "",
    manufacturer: "",
    batch_no: "",
    quantity: "",
    status: "In Stock",
    notes: "",
    expiry_date: "",
  });

  // Fetch Medicine List
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMedicines(res.data || []);
    } catch (e) {
      console.log("Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Handle Form Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      brand_name: formData.brand_name,
      generic_name: formData.generic_name,
      strength: formData.strength,
      manufacturer: formData.manufacturer,
      batch_no: formData.batch_no,
      quantity: Number(formData.quantity),

      // 🔥 FIX: Convert status string → number
      status: formData.status === "In Stock" ? 1 : 0,

      notes: formData.notes,
      expiry_date: formData.expiry_date || null,
    };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Medicine updated successfully!");
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Medicine added successfully!");
      }

      setShowModal(false);
      setEditId(null);

      // Reset form
      setFormData({
        brand_name: "",
        generic_name: "",
        strength: "",
        manufacturer: "",
        batch_no: "",
        quantity: "",
        status: "In Stock",
        notes: "",
        expiry_date: "",
      });

      fetchMedicines();
    } catch (error) {
      console.log("Submit Error:", error);
      alert("Submit Failed!");
    }
  };

  // Edit Handler
  const handleEdit = (med) => {
    setEditId(med.id);

    setFormData({
      brand_name: med.brand_name,
      generic_name: med.generic_name,
      strength: med.strength,
      manufacturer: med.manufacturer,
      batch_no: med.batch_no,
      quantity: med.quantity,

      // 🔥 FIX: convert INT → string for form
      status: med.status === 1 ? "In Stock" : "Out of Stock",

      notes: med.notes,
      expiry_date: med.expiry_date?.split("T")[0] || "",
    });

    setShowModal(true);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Deleted Successfully!");
      fetchMedicines();
    } catch (e) {
      console.log("Delete Error:", e);
      alert("Delete failed!");
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pharmacy Management</h1>
        <Button onClick={() => setShowModal(true)} icon={Plus}>
          Add Medicine
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Brand</th>
              <th className="p-3 border">Generic</th>
              <th className="p-3 border">Strength</th>
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Manufacturer</th>
              <th className="p-3 border">Expiry</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {medicines.length > 0 ? (
              medicines.map((m) => (
                <tr key={m.id} className="text-center">
                  <td className="p-3 border">{m.id}</td>
                  <td className="p-3 border">{m.brand_name}</td>
                  <td className="p-3 border">{m.generic_name}</td>
                  <td className="p-3 border">{m.strength}</td>
                  <td className="p-3 border">{m.quantity}</td>
                  <td className="p-3 border">
                    {m.status === 1 ? "In Stock" : "Out of Stock"}
                  </td>
                  <td className="p-3 border">{m.manufacturer}</td>
                  <td className="p-3 border">
                    {m.expiry_date
                      ? new Date(m.expiry_date).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3 border space-x-3">
                    <button
                      onClick={() => handleEdit(m)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-3 text-center">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Medicine" : "Add Medicine"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                placeholder="Brand Name"
                className="border p-2 rounded"
                required
              />

              <input
                name="generic_name"
                value={formData.generic_name}
                onChange={handleChange}
                placeholder="Generic Name"
                className="border p-2 rounded"
                required
              />

              <input
                name="strength"
                value={formData.strength}
                onChange={handleChange}
                placeholder="Strength"
                className="border p-2 rounded"
              />

              <input
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="border p-2 rounded"
              />

              <input
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="Manufacturer"
                className="border p-2 rounded"
              />

              <input
                name="batch_no"
                value={formData.batch_no}
                onChange={handleChange}
                placeholder="Batch Number"
                className="border p-2 rounded"
              />

              {/* Status Dropdown */}
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              <input
                name="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="border p-2 rounded"
              />

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
                className="border p-2 rounded col-span-2"
              />

              <div className="flex justify-end gap-2 col-span-2">
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                  }}
                  className="bg-gray-400"
                >
                  Cancel
                </Button>

                <Button type="submit" className="bg-purple-400">
                  {editId ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



