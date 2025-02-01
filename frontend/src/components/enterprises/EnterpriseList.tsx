import { useState, useEffect } from "react";
import api from "../../services/api";

interface Enterprise {
  id: number;
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

export default function EnterpriseList() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const response = await api.get("/enterprises");
        setEnterprises(response.data);
      } catch (error) {
        console.error("Failed to fetch enterprises:", error);
      }
    };
    fetchEnterprises();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enterprises</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Enterprise
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capital</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enterprises.map((enterprise) => (
              <tr key={enterprise.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{enterprise.name}</div>
                  <div className="text-sm text-gray-500">{enterprise.legal_representative}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{enterprise.registration_number}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{enterprise.contact_phone}</div>
                  <div className="text-sm text-gray-500">{enterprise.contact_email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{enterprise.registered_capital}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
