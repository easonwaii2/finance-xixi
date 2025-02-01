import { useState } from "react";
import { Card } from "../components/ui/card";
import { useToast } from "../components/ui/use-toast";
import LoanApplicationList from "../components/loan-applications/LoanApplicationList";
import LoanApplicationForm from "../components/loan-applications/LoanApplicationForm";
import api from "../services/api";

interface LoanApplicationData {
  enterprise_id: number;
  loan_product_id: number;
  amount: number;
  term_months: number;
  purpose: string;
  guarantee_type: string;
  guarantee_amount: number;
  financial_statement: string;
  business_plan: string;
}

export default function Applications() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState<LoanApplicationData | undefined>(undefined);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const maxFileSize = Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 5242880;
      const files = ['financial_statement', 'business_plan'].map(
        key => formData.get(key) as File
      ).filter(Boolean);

      for (const file of files) {
        if (file.size > maxFileSize) {
          toast({
            title: "Error",
            description: `File ${file.name} exceeds maximum size of ${maxFileSize / 1024 / 1024}MB`,
            variant: "destructive",
          });
          return;
        }
      }

      if (editingApplication) {
        await api.put(`/loan-applications/${editingApplication.enterprise_id}`, formData, config);
        toast({
          title: "Success",
          description: "Loan application updated successfully",
        });
      } else {
        await api.post("/loan-applications", formData, config);
        toast({
          title: "Success",
          description: "Loan application submitted successfully",
        });
      }
      setShowForm(false);
      setEditingApplication(undefined);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to submit loan application",
        variant: "destructive",
      });
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {editingApplication ? "Edit Application" : "New Application"}
          </h1>
          <button
            onClick={() => {
              setShowForm(false);
              setEditingApplication(null);
            }}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            Cancel
          </button>
        </div>
        <Card className="p-6">
          <LoanApplicationForm
            onSubmit={handleFormSubmit}
            initialData={editingApplication}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LoanApplicationList onNewApplication={() => setShowForm(true)} />
    </div>
  );
}
