import { useState } from "react";
import api from "../../services/api";

interface EnterpriseFormData {
  name: string;
  registration_number: string;
  legal_representative: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  business_scope: string;
  registered_capital: number;
  established_date: string;
}

export default function EnterpriseForm() {
  const [formData, setFormData] = useState<EnterpriseFormData>({
    name: "",
    registration_number: "",
    legal_representative: "",
    contact_phone: "",
    contact_email: "",
    address: "",
    business_scope: "",
    registered_capital: 0,
    established_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/enterprises", formData);
      // Handle success
    } catch (error) {
      console.error("Failed to create enterprise:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold">Add Enterprise</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Enterprise Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Registration Number</label>
          <input
            type="text"
            value={formData.registration_number}
            onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Legal Representative</label>
          <input
            type="text"
            value={formData.legal_representative}
            onChange={(e) => setFormData({ ...formData, legal_representative: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Business Scope</label>
          <textarea
            value={formData.business_scope}
            onChange={(e) => setFormData({ ...formData, business_scope: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Registered Capital</label>
          <input
            type="number"
            value={formData.registered_capital}
            onChange={(e) => setFormData({ ...formData, registered_capital: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Established Date</label>
          <input
            type="date"
            value={formData.established_date}
            onChange={(e) => setFormData({ ...formData, established_date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Enterprise
        </button>
      </div>
    </form>
  );
}
