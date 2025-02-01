import { useState, useEffect } from "react";
import api from "../../services/api";

interface ApprovalTask {
  id: number;
  loan_application_id: number;
  status: string;
  comments: string;
  created_at: string;
  loan_application: {
    enterprise: {
      name: string;
    };
    amount: number;
    purpose: string;
  };
}

export default function ApprovalList() {
  const [tasks, setTasks] = useState<ApprovalTask[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/approvals");
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch approval tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await api.post(`/approvals/${id}/approve`);
      // Refresh tasks
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.post(`/approvals/${id}/reject`);
      // Refresh tasks
    } catch (error) {
      console.error("Failed to reject:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Approval Tasks</h2>
      <div className="grid gap-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">
                  {task.loan_application.enterprise.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Amount: {task.loan_application.amount}
                </p>
                <p className="text-sm text-gray-500">
                  Purpose: {task.loan_application.purpose}
                </p>
              </div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${task.status === "approved" ? "bg-green-100 text-green-800" :
                  task.status === "rejected" ? "bg-red-100 text-red-800" :
                  "bg-yellow-100 text-yellow-800"}`}>
                {task.status}
              </span>
            </div>
            <div className="mt-4">
              <textarea
                placeholder="Add comments..."
                className="w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => handleApprove(task.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(task.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
