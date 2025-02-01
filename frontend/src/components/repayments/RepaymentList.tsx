import { useState, useEffect } from "react";
import api from "../../services/api";

interface RepaymentPlan {
  id: number;
  loan_application_id: number;
  due_date: string;
  principal_amount: number;
  interest_amount: number;
  status: string;
  loan_application: {
    enterprise: {
      name: string;
    };
  };
}

export default function RepaymentList() {
  const [plans, setPlans] = useState<RepaymentPlan[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/repayments");
        setPlans(response.data);
      } catch (error) {
        console.error("Failed to fetch repayment plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const handleRecordPayment = async (id: number) => {
    try {
      await api.post(`/repayments/${id}/record-payment`);
      // Refresh plans
    } catch (error) {
      console.error("Failed to record payment:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Repayment Plans</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enterprise</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {plan.loan_application.enterprise.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(plan.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    Principal: {plan.principal_amount}
                  </div>
                  <div className="text-sm text-gray-500">
                    Interest: {plan.interest_amount}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${plan.status === "paid" ? "bg-green-100 text-green-800" :
                      plan.status === "overdue" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"}`}>
                    {plan.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {plan.status !== "paid" && (
                    <button
                      onClick={() => handleRecordPayment(plan.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Record Payment
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
