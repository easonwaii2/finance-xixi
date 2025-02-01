import { useState, useEffect } from "react";
import api from "../../services/api";

interface LoanApplication {
  id: number;
  enterprise_id: number;
  loan_product_id: number;
  amount: number;
  term_months: number;
  purpose: string;
  status: string;
  created_at: string;
  enterprise: {
    name: string;
  };
  loan_product: {
    name: string;
  };
}

export default function LoanApplicationList() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/loan-applications");
        setApplications(response.data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Loan Applications</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Application
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enterprise</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{application.enterprise?.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{application.loan_product?.name}</div>
                  <div className="text-sm text-gray-500">{application.term_months} months</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{application.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${application.status === "approved" ? "bg-green-100 text-green-800" :
                      application.status === "rejected" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"}`}>
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                  <button className="text-red-600 hover:text-red-900">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
