import axios from "axios";

const API_URL = "http://localhost:5000/api/doctors";

export const doctorsApi = {
  async getAll() {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      console.error("Error fetching doctors:", err);
      throw err;
    }
  },
};
