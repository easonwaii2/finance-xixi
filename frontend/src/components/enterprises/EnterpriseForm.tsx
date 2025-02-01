import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../ui/use-toast";
import api from "../../services/api";

interface EnterpriseFormData {
  name: string;
  registration_number: string;
  legal_representative: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  business_scope: string;
  registered_capital: number;
  established_date: string;
  annual_revenue: number;
  employee_count: number;
  credit_score: number;
  guarantee_type: string;
  guarantee_amount: number;
}

interface EnterpriseFormProps {
  initialData?: EnterpriseFormData;
  onSuccess?: () => void;
}

export default function EnterpriseForm({ initialData, onSuccess }: EnterpriseFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EnterpriseFormData>(initialData || {
    name: "",
    registration_number: "",
    legal_representative: "",
    contact_phone: "",
    contact_email: "",
    address: "",
    business_scope: "",
    registered_capital: 0,
    established_date: "",
    annual_revenue: 0,
    employee_count: 0,
    credit_score: 0,
    guarantee_type: "MORTGAGE",
    guarantee_amount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await api.put(`/enterprises/${initialData.id}`, formData);
      } else {
        await api.post("/enterprises", formData);
      }
      toast({
        title: "Success",
        description: `Enterprise ${initialData ? "updated" : "created"} successfully`,
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initialData ? "update" : "create"} enterprise`,
        variant: "destructive",
      });
      console.error("Failed to save enterprise:", error);
    }
  };

  const handleChange = (field: keyof EnterpriseFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Enterprise Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration_number">Registration Number</Label>
              <Input
                id="registration_number"
                value={formData.registration_number}
                onChange={(e) => handleChange("registration_number", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legal_representative">Legal Representative</Label>
              <Input
                id="legal_representative"
                value={formData.legal_representative}
                onChange={(e) => handleChange("legal_representative", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleChange("contact_phone", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleChange("contact_email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registered_capital">Registered Capital</Label>
              <Input
                id="registered_capital"
                type="number"
                min="0"
                step="0.01"
                value={formData.registered_capital}
                onChange={(e) => handleChange("registered_capital", parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="annual_revenue">Annual Revenue</Label>
              <Input
                id="annual_revenue"
                type="number"
                min="0"
                step="0.01"
                value={formData.annual_revenue}
                onChange={(e) => handleChange("annual_revenue", parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_count">Employee Count</Label>
              <Input
                id="employee_count"
                type="number"
                min="1"
                value={formData.employee_count}
                onChange={(e) => handleChange("employee_count", parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credit_score">Credit Score</Label>
              <Input
                id="credit_score"
                type="number"
                min="0"
                max="1000"
                value={formData.credit_score}
                onChange={(e) => handleChange("credit_score", parseInt(e.target.value))}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_scope">Business Scope</Label>
            <Input
              id="business_scope"
              value={formData.business_scope}
              onChange={(e) => handleChange("business_scope", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="established_date">Established Date</Label>
            <Input
              id="established_date"
              type="date"
              value={formData.established_date}
              onChange={(e) => handleChange("established_date", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guarantee Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guarantee_type">Guarantee Type</Label>
              <Select
                value={formData.guarantee_type}
                onValueChange={(value) => handleChange("guarantee_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select guarantee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MORTGAGE">Mortgage</SelectItem>
                  <SelectItem value="PLEDGE">Pledge</SelectItem>
                  <SelectItem value="GUARANTEE">Guarantee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guarantee_amount">Guarantee Amount</Label>
              <Input
                id="guarantee_amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.guarantee_amount}
                onChange={(e) => handleChange("guarantee_amount", parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">
          {initialData ? "Update Enterprise" : "Create Enterprise"}
        </Button>
      </div>
    </form>
  );
}
