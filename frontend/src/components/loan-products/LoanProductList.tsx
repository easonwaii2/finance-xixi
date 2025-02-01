import { useState, useEffect } from "react";
import api from "../../services/api";

interface LoanProduct {
  id: number;
  name: string;
  product_type: string;
  interest_rate: number;
  term_months: number;
  repayment_method: string;
  min_amount: number;
  max_amount: number;
  is_active: boolean;
}

export default function LoanProductList() {
  const [products, setProducts] = useState<LoanProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/loan-products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch loan products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Loan Products</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Product
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {product.product_type} | {product.term_months} months |{" "}
                    {product.interest_rate}% interest
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    {product.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Amount Range: {product.min_amount} - {product.max_amount} |
                Repayment: {product.repayment_method}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
