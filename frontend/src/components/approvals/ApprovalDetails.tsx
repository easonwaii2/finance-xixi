import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import ApprovalForm from "./ApprovalForm";
import api from "../../services/api";

interface ApprovalDetails {
  id: number;
  loan_application_id: number;
  enterprise_name: string;
  loan_amount: number;
  term_months: number;
  purpose: string;
  status: string;
  financial_statement_url: string;
  business_plan_url: string;
  created_at: string;
  approval_history: Array<{
    id: number;
    approver_name: string;
    status: string;
    comments: string;
    created_at: string;
  }>;
}

interface ApprovalDetailsProps {
  applicationId: number;
  onClose?: () => void;
}

export default function ApprovalDetails({ applicationId, onClose }: ApprovalDetailsProps) {
  const { toast } = useToast();
  const [details, setDetails] = useState<ApprovalDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApprovalForm, setShowApprovalForm] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [applicationId]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/approval-process/${applicationId}/details`);
      setDetails(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to load approval details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovalComplete = () => {
    fetchDetails();
    setShowApprovalForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500">Loading details...</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-red-500">Failed to load approval details</p>
      </div>
    );
  }

  if (showApprovalForm) {
    return (
      <ApprovalForm
        applicationId={applicationId}
        onApproved={handleApprovalComplete}
        onRejected={handleApprovalComplete}
        onCancel={() => setShowApprovalForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Application Details</h2>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enterprise Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Enterprise Name</dt>
              <dd className="text-lg">{details.enterprise_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Loan Amount</dt>
              <dd className="text-lg">{details.loan_amount.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Term</dt>
              <dd className="text-lg">{details.term_months} months</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-lg">{details.status}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Financial Statement</h4>
              <Button
                variant="outline"
                onClick={() => window.open(details.financial_statement_url)}
              >
                View Document
              </Button>
            </div>
            <div>
              <h4 className="font-medium mb-2">Business Plan</h4>
              <Button
                variant="outline"
                onClick={() => window.open(details.business_plan_url)}
              >
                View Document
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approval History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {details.approval_history.map((record) => (
              <div key={record.id} className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{record.approver_name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(record.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.status === 'approved' ? 'bg-green-100 text-green-800' :
                    record.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.status}
                  </span>
                </div>
                <p className="text-gray-700">{record.comments}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {details.status === 'pending' && (
        <div className="flex justify-end">
          <Button onClick={() => setShowApprovalForm(true)}>
            Review Application
          </Button>
        </div>
      )}
    </div>
  );
}
