import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
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

interface ApprovalListProps {
  onViewDetails: (applicationId: number) => void;
}

export default function ApprovalList({ onViewDetails }: ApprovalListProps) {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<ApprovalTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/approval-process/pending");
      setTasks(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to fetch approval tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Approval Tasks</h2>
        <Button variant="outline" onClick={fetchTasks} disabled={isLoading}>
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Loading approvals...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">No pending approvals</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium">Enterprise</th>
                    <th className="py-3 px-4 text-left font-medium">Amount</th>
                    <th className="py-3 px-4 text-left font-medium">Purpose</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-b">
                      <td className="py-3 px-4">
                        <div className="font-medium">
                          {task.loan_application.enterprise.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {task.loan_application.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {task.loan_application.purpose}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetails(task.id)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
