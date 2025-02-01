import { useState, useEffect } from "react";
import api from "../../services/api";

interface Commission {
  id: number;
  salesperson_id: number;
  loan_application_id: number;
  amount: number;
  status: string;
  payment_date: string | null;
  salesperson: {
    user: {
      username: string;
    };
  };
  loan_application: {
    enterprise: {
      name: string;
    };
    amount: number;
  };
}

export default function CommissionList() {
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const response = await api.get("/commissions");
        setCommissions(response.data);
      } catch (error) {
        console.error("Failed to fetch commissions:", error);
      }
    };
    fetchCommissions();
  }, []);

  const handlePayCommission = async (id: number) => {
    try {
      await api.post(`/commissions/${id}/pay`);
      // Refresh commissions
    } catch (error) {
      console.error("Failed to pay commission:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Commission Management</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Person</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enterprise</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commissions.map((commission) => (
              <tr key={commission.id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {commission.salesperson?.user?.username}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {commission.loan_application?.enterprise?.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {commission.loan_application?.amount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {commission.amount}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${commission.status === "paid" ? "bg-green-100 text-green-800" :
                      "bg-yellow-100 text-yellow-800"}`}>
                    {commission.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {commission.status !== "paid" && (
                    <button
                      onClick={() => handlePayCommission(commission.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Pay Commission
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
