import { useState, useEffect } from "react";
import api from "../../services/api";

interface LoanApplicationFormData {
  enterprise_id: number;
  loan_product_id: number;
  amount: number;
  term_months: number;
  purpose: string;
}

interface Enterprise {
  id: number;
  name: string;
}

interface LoanProduct {
  id: number;
  name: string;
  min_amount: number;
  max_amount: number;
  term_months: number;
}

export default function LoanApplicationForm() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [formData, setFormData] = useState<LoanApplicationFormData>({
    enterprise_id: 0,
    loan_product_id: 0,
    amount: 0,
    term_months: 0,
    purpose: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enterprisesRes, productsRes] = await Promise.all([
          api.get("/enterprises"),
          api.get("/loan-products"),
        ]);
        setEnterprises(enterprisesRes.data);
        setLoanProducts(productsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/loan-applications", formData);
      // Handle success
    } catch (error) {
      console.error("Failed to create application:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold">New Loan Application</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Enterprise</label>
          <select
            value={formData.enterprise_id}
            onChange={(e) => setFormData({ ...formData, enterprise_id: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select Enterprise</option>
            {enterprises.map((enterprise) => (
              <option key={enterprise.id} value={enterprise.id}>
                {enterprise.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Loan Product</label>
          <select
            value={formData.loan_product_id}
            onChange={(e) => setFormData({ ...formData, loan_product_id: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Select Product</option>
            {loanProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Term (Months)</label>
          <input
            type="number"
            value={formData.term_months}
            onChange={(e) => setFormData({ ...formData, term_months: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Purpose</label>
          <textarea
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Application
        </button>
      </div>
    </form>
  );
}
