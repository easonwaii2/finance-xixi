import { useState } from "react";
import api from "../../services/api";

interface LoanProductFormData {
  name: string;
  product_type: string;
  interest_rate: number;
  term_months: number;
  repayment_method: string;
  min_amount: number;
  max_amount: number;
}

export default function LoanProductForm() {
  const [formData, setFormData] = useState<LoanProductFormData>({
    name: "",
    product_type: "",
    interest_rate: 0,
    term_months: 0,
    repayment_method: "monthly",
    min_amount: 0,
    max_amount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/loan-products", formData);
      // Handle success (e.g., show notification, redirect)
    } catch (error) {
      console.error("Failed to create loan product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold">Create Loan Product</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Type</label>
          <input
            type="text"
            value={formData.product_type}
            onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
          <input
            type="number"
            step="0.01"
            value={formData.interest_rate}
            onChange={(e) => setFormData({ ...formData, interest_rate: parseFloat(e.target.value) })}
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Repayment Method</label>
          <select
            value={formData.repayment_method}
            onChange={(e) => setFormData({ ...formData, repayment_method: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Amount</label>
          <input
            type="number"
            value={formData.min_amount}
            onChange={(e) => setFormData({ ...formData, min_amount: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Maximum Amount</label>
          <input
            type="number"
            value={formData.max_amount}
            onChange={(e) => setFormData({ ...formData, max_amount: parseFloat(e.target.value) })}
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
          Create Product
        </button>
      </div>
    </form>
  );
}
