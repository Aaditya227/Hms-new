
// update 2

import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Plus } from "../lib/icons";
import { Button } from "../components/common/Button";
import base_url from "../utils/baseurl";

const API_URL = `${base_url}/medicines`;

export default function Pharmacy() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    brandName: "",
    genericName: "",
    strength: "",
    stock: "",
    reorderLevel: "",
    expiryDate: "",
    manufacturer: "",
    batchNumber: "",
    status: "IN_STOCK",
    notes: "",
  });

  // Fetch Medicines
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(editId ? "Updated Successfully!" : "Added Successfully!");
        setShowModal(false);
        setEditId(null);

        setFormData({
          brandName: "",
          genericName: "",
          strength: "",
          stock: "",
          reorderLevel: "",
          expiryDate: "",
          manufacturer: "",
          batchNumber: "",
          status: "IN_STOCK",
          notes: "",
        });

        fetchMedicines();
      } else {
        alert(data.message || "Error");
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  // Edit Handler
  const handleEdit = (med) => {
    setEditId(med.id);
    setFormData({
      brandName: med.brandName,
      genericName: med.genericName,
      strength: med.strength,
      stock: med.stock,
      reorderLevel: med.reorderLevel,
      expiryDate: med.expiryDate ? med.expiryDate.split("T")[0] : "",
      manufacturer: med.manufacturer,
      batchNumber: med.batchNumber,
      status: med.status,
      notes: med.notes,
    });
    setShowModal(true);
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Deleted Successfully");
        fetchMedicines();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-4xl font-bold">Pharmacy Management</h1>

        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center w-full sm:w-auto"
          icon={Plus}
        >
          Add Medicine 
        </Button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border-collapse text-sm md:text-base">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 md:p-3 border">ID</th>
                <th className="p-2 md:p-3 border">Brand</th>
                <th className="p-2 md:p-3 border">Generic</th>
                <th className="p-2 md:p-3 border">Strength</th>
                <th className="p-2 md:p-3 border">Stock</th>
                <th className="p-2 md:p-3 border">Status</th>
                <th className="p-2 md:p-3 border">Expiry</th>
                <th className="p-2 md:p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {medicines.length > 0 ? (
                medicines.map((m) => (
                  <tr key={m.id} className="text-center">
                    <td className="p-2 md:p-3 border">{m.id}</td>
                    <td className="p-2 md:p-3 border">{m.brandName}</td>
                    <td className="p-2 md:p-3 border">{m.genericName}</td>
                    <td className="p-2 md:p-3 border">{m.strength}</td>
                    <td className="p-2 md:p-3 border">{m.stock}</td>
                    <td className="p-2 md:p-3 border">{m.status}</td>
                    <td className="p-2 md:p-3 border">
                      {m.expiryDate
                        ? new Date(m.expiryDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2 md:p-3 border space-x-2">
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
                  <td
                    colSpan="8"
                    className="p-4 text-center text-gray-500"
                  >
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              {editId ? "Edit Medicine" : "Add New Medicine"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <input
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Brand Name"
                className="border p-2 rounded w-full"
                required
              />

              <input
                name="genericName"
                value={formData.genericName}
                onChange={handleChange}
                placeholder="Generic Name"
                className="border p-2 rounded w-full"
                required
              />

              <input
                name="strength"
                value={formData.strength}
                onChange={handleChange}
                placeholder="Strength"
                className="border p-2 rounded w-full"
              />

              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="border p-2 rounded w-full"
              />

              <input
                name="reorderLevel"
                type="number"
                value={formData.reorderLevel}
                onChange={handleChange}
                placeholder="Reorder Level"
                className="border p-2 rounded w-full"
              />

              <input
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />

              <input
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="Manufacturer"
                className="border p-2 rounded w-full"
              />

              <input
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                placeholder="Batch Number"
                className="border p-2 rounded w-full"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              >
                <option value="IN_STOCK">In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Notes"
                className="border p-2 rounded w-full sm:col-span-2"
              />

              <div className="flex justify-end gap-2 sm:col-span-2 mt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditId(null);
                  }}
                  className="bg-gray-400 hover:bg-gray-500"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-[rgb(167,139,250)] hover:bg-gray-500"
                >
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
