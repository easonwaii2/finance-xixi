import { useState, useEffect } from "react";
import api from "../../services/api";

interface Salesperson {
  id: number;
  user_id: number;
  region: string;
  target_amount: number;
  user: {
    username: string;
    email: string;
  };
}

export default function SalesList() {
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);

  useEffect(() => {
    const fetchSalespeople = async () => {
      try {
        const response = await api.get("/salespeople");
        setSalespeople(response.data);
      } catch (error) {
        console.error("Failed to fetch salespeople:", error);
      }
    };
    fetchSalespeople();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Team</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Sales Person
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salespeople.map((person) => (
              <tr key={person.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{person.user?.username}</div>
                  <div className="text-sm text-gray-500">{person.user?.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{person.region}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{person.target_amount}</td>
                <td className="px-6 py-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <span className="text-sm text-gray-500">45% of target</span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
