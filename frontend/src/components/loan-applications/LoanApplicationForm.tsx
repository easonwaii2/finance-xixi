import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../ui/use-toast";
import api from "../../services/api";

interface Enterprise {
  id: number;
  name: string;
}

interface LoanProduct {
  id: number;
  name: string;
  interest_rate: number;
  term_months: number;
}

interface LoanApplicationFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: LoanApplicationData;
}

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

export default function LoanApplicationForm({ onSubmit, initialData }: LoanApplicationFormProps) {
  const { toast } = useToast();
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [formData, setFormData] = useState<LoanApplicationData>(
    initialData || {
      enterprise_id: 0,
      loan_product_id: 0,
      amount: 0,
      term_months: 12,
      purpose: "",
      guarantee_type: "",
      guarantee_amount: 0,
      financial_statement: "",
      business_plan: "",
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enterprisesRes, productsRes] = await Promise.all([
          api.get("/enterprises"),
          api.get("/loan-products")
        ]);
        setEnterprises(enterprisesRes.data);
        setLoanProducts(productsRes.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: string[] = [];
    
    if (!formData.enterprise_id) validationErrors.push("Please select an enterprise");
    if (!formData.loan_product_id) validationErrors.push("Please select a loan product");
    if (!formData.amount || formData.amount <= 0) validationErrors.push("Please enter a valid loan amount");
    if (!formData.term_months || formData.term_months < 1) validationErrors.push("Please enter a valid loan term");
    if (!formData.purpose?.trim()) validationErrors.push("Please enter the loan purpose");
    if (!formData.guarantee_type) validationErrors.push("Please select a guarantee type");
    if (!formData.guarantee_amount || formData.guarantee_amount <= 0) validationErrors.push("Please enter a valid guarantee amount");

    const financialStatementInput = document.getElementById('financial_statement') as HTMLInputElement;
    const businessPlanInput = document.getElementById('business_plan') as HTMLInputElement;

    if (!financialStatementInput?.files?.[0]) validationErrors.push("Please upload a financial statement");
    if (!businessPlanInput?.files?.[0]) validationErrors.push("Please upload a business plan");

    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join("\n"),
        variant: "destructive",
      });
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'financial_statement' && key !== 'business_plan' && value !== undefined && value !== null) {
        formDataToSend.append(key, value.toString());
      }
    });

    const maxSize = Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 5242880;
    const allowedTypes = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]);

    const validateFile = (file: File, fieldName: string): boolean => {
      if (file.size > maxSize) {
        toast({
          title: "File Size Error",
          description: `${fieldName} exceeds maximum size of ${maxSize / 1024 / 1024}MB`,
          variant: "destructive",
        });
        return false;
      }
      if (!allowedTypes.has(file.type)) {
        toast({
          title: "File Type Error",
          description: `${fieldName} must be a PDF, Word, or Excel file`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    };

    const financialStatement = financialStatementInput?.files?.[0];
    const businessPlan = businessPlanInput?.files?.[0];

    if (!financialStatement || !businessPlan) {
      toast({
        title: "Error",
        description: "Please upload both financial statement and business plan",
        variant: "destructive",
      });
      return;
    }

    const validateFile = (file: File, fieldName: string): boolean => {
      const maxSize = Number(import.meta.env.VITE_MAX_UPLOAD_SIZE);
      const allowedTypes = import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [];

      if (!maxSize) {
        toast({
          title: "Configuration Error",
          description: "Maximum file size not configured",
          variant: "destructive",
        });
        return false;
      }

      if (file.size > maxSize) {
        toast({
          title: "File Size Error",
          description: `${fieldName} must be smaller than ${maxSize / 1024 / 1024}MB`,
          variant: "destructive",
        });
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "File Type Error",
          description: `${fieldName} must be a ${fieldName === "Financial Statement" ? "PDF, Word, or Excel file" : "PDF or Word document"}`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    };

    if (!validateFile(financialStatement, "Financial Statement") || 
        !validateFile(businessPlan, "Business Plan")) {
      return;
    }

    formDataToSend.append('financial_statement', financialStatement);
    formDataToSend.append('business_plan', businessPlan);

    try {
      setIsSubmitting(true);
      await onSubmit(formDataToSend);
      toast({
        title: "Success",
        description: "Loan application submitted successfully",
      });
      window.history.back();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
        (typeof error.message === 'string' ? error.message : "Failed to submit loan application");
      
      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="enterprise">Enterprise</Label>
              <Select
                value={formData.enterprise_id.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, enterprise_id: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select enterprise" />
                </SelectTrigger>
                <SelectContent>
                  {enterprises.map((enterprise) => (
                    <SelectItem key={enterprise.id} value={enterprise.id.toString()}>
                      {enterprise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loan_product">Loan Product</Label>
              <Select
                value={formData.loan_product_id.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, loan_product_id: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loan product" />
                </SelectTrigger>
                <SelectContent>
                  {loanProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} ({product.term_months} months, {product.interest_rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term_months">Term (Months)</Label>
              <Input
                id="term_months"
                type="number"
                value={formData.term_months}
                onChange={(e) =>
                  setFormData({ ...formData, term_months: parseInt(e.target.value) })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Loan Purpose</Label>
            <Input
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guarantee Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guarantee_type">Guarantee Type</Label>
              <Select
                value={formData.guarantee_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, guarantee_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select guarantee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MORTGAGE">Mortgage</SelectItem>
                  <SelectItem value="PLEDGE">Pledge</SelectItem>
                  <SelectItem value="GUARANTEE">Third-party Guarantee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guarantee_amount">Guarantee Amount</Label>
              <Input
                id="guarantee_amount"
                type="number"
                value={formData.guarantee_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guarantee_amount: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supporting Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="financial_statement">Financial Statement</Label>
            <Input
              id="financial_statement"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const maxSize = Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 5242880;
                  const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  ];
                  
                  if (file.size > maxSize) {
                    toast({
                      title: "File Size Error",
                      description: `Financial statement must be smaller than ${maxSize / 1024 / 1024}MB`,
                      variant: "destructive",
                    });
                    e.target.value = '';
                    return;
                  }
                  
                  if (!allowedTypes.includes(file.type)) {
                    toast({
                      title: "File Type Error",
                      description: "Financial statement must be a PDF, Word, or Excel file",
                      variant: "destructive",
                    });
                    e.target.value = '';
                    return;
                  }
                  
                  setUploadProgress(prev => ({ ...prev, financial_statement: 0 }));
                  const reader = new FileReader();
                  reader.onprogress = (event) => {
                    if (event.lengthComputable) {
                      const progress = Math.round((event.loaded / event.total) * 100);
                      setUploadProgress(prev => ({ ...prev, financial_statement: progress }));
                    }
                  };
                  reader.onload = () => {
                    setFormData({
                      ...formData,
                      financial_statement: file.name,
                    });
                    setUploadProgress(prev => ({ ...prev, financial_statement: 100 }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              disabled={isSubmitting}
              required
            />
            <p className="text-sm text-gray-500">
              Accepted formats: PDF, Word, Excel. Maximum size: {(Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 5242880) / 1024 / 1024}MB
            </p>
            {uploadProgress.financial_statement !== undefined && uploadProgress.financial_statement < 100 && (
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.financial_statement}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress.financial_statement}%</p>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_plan">Business Plan</Label>
            <Input
              id="business_plan"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const maxSize = Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 5242880;
                  const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  ];
                  
                  if (file.size > maxSize) {
                    toast({
                      title: "File Size Error",
                      description: `Business plan must be smaller than ${maxSize / 1024 / 1024}MB`,
                      variant: "destructive",
                    });
                    e.target.value = '';
                    return;
                  }
                  
                  if (!allowedTypes.includes(file.type)) {
                    toast({
                      title: "File Type Error",
                      description: "Business plan must be a PDF or Word document",
                      variant: "destructive",
                    });
                    e.target.value = '';
                    return;
                  }
                  
                  setUploadProgress(prev => ({ ...prev, business_plan: 0 }));
                  const reader = new FileReader();
                  reader.onprogress = (event) => {
                    if (event.lengthComputable) {
                      const progress = Math.round((event.loaded / event.total) * 100);
                      setUploadProgress(prev => ({ ...prev, business_plan: progress }));
                    }
                  };
                  reader.onload = () => {
                    setFormData({
                      ...formData,
                      business_plan: file.name,
                    });
                    setUploadProgress(prev => ({ ...prev, business_plan: 100 }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              disabled={isSubmitting}
              required
            />
            <p className="text-sm text-gray-500">
              Accepted formats: PDF, Word. Maximum size: {(Number(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 5242880) / 1024 / 1024}MB
            </p>
            {uploadProgress.business_plan !== undefined && uploadProgress.business_plan < 100 && (
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.business_plan}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Uploading: {uploadProgress.business_plan}%</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || formData.enterprise_id === 0 || formData.loan_product_id === 0}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
