import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/common/Button";
import { X, Edit2, Trash2, Plus } from "lucide-react";
import base_url from "../utils/baseurl";

export default function PatientPaymentHistory() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Patient Payment History</h1>      
    </div>
  );
}

