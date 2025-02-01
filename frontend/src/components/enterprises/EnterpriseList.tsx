import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import api from "../../services/api";
import EnterpriseForm from "./EnterpriseForm";

interface Enterprise {
  id: number;
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

export default function EnterpriseList() {
  const { toast } = useToast();
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState<Enterprise | null>(null);

  const fetchEnterprises = async () => {
    try {
      const response = await api.get("/enterprises");
      setEnterprises(response.data);
    } catch (error) {
      console.error("Failed to fetch enterprises:", error);
      toast({
        title: "Error",
        description: "Failed to load enterprises",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this enterprise?")) {
      return;
    }

    try {
      await api.delete(`/enterprises/${id}`);
      toast({
        title: "Success",
        description: "Enterprise deleted successfully",
      });
      fetchEnterprises();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete enterprise",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (enterprise: Enterprise) => {
    setEditingEnterprise(enterprise);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Omit<Enterprise, "id">) => {
    try {
      if (editingEnterprise) {
        await api.put(`/enterprises/${editingEnterprise.id}`, data);
      } else {
        await api.post("/enterprises", data);
      }
      setShowForm(false);
      setEditingEnterprise(null);
      fetchEnterprises();
    } catch (error) {
      console.error("Failed to save enterprise:", error);
      throw error;
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {editingEnterprise ? "Edit Enterprise" : "Add Enterprise"}
          </h2>
          <Button variant="outline" onClick={() => {
            setShowForm(false);
            setEditingEnterprise(null);
          }}>
            Cancel
          </Button>
        </div>
        <EnterpriseForm
          initialData={editingEnterprise || undefined}
          onSubmit={handleFormSubmit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enterprises</h2>
        <Button onClick={() => setShowForm(true)}>
          Add Enterprise
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Enterprise List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium">Registration</th>
                  <th className="py-3 px-4 text-left font-medium">Contact</th>
                  <th className="py-3 px-4 text-left font-medium">Capital</th>
                  <th className="py-3 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enterprises.map((enterprise) => (
                  <tr key={enterprise.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="font-medium">{enterprise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {enterprise.legal_representative}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {enterprise.registration_number}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">{enterprise.contact_phone}</div>
                      <div className="text-sm text-muted-foreground">
                        {enterprise.contact_email}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {enterprise.registered_capital.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEdit(enterprise)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(enterprise.id)}
                      >
                        Delete
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
