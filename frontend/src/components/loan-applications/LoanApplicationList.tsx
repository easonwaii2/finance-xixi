import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import api from "../../services/api";

interface LoanApplication {
  id: number;
  enterprise_id: number;
  enterprise_name: string;
  loan_product_id: number;
  amount: number;
  term_months: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface LoanApplicationListProps {
  onNewApplication: () => void;
}

export default function LoanApplicationList({ onNewApplication }: LoanApplicationListProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get("/loan-applications");
      setApplications(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
        (typeof error.message === 'string' ? error.message : "Failed to load loan applications");
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Loan Applications</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchApplications} disabled={isLoading}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={() => onNewApplication()} disabled={isLoading}>
            New Application
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Loading applications...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">No loan applications found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-medium">Enterprise</th>
                    <th className="py-3 px-4 text-left font-medium">Amount</th>
                    <th className="py-3 px-4 text-left font-medium">Term</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                  <tr key={application.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="font-medium">{application.enterprise_name}</div>
                    </td>
                    <td className="py-3 px-4">
                      {application.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{application.term_months} months</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/loan-applications/${application.id}`}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
