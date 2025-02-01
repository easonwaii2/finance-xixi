import { useState, useEffect } from 'react';
import api from '../services/api';

interface LoanProduct {
  id: number;
  name: string;
  product_type: string;
  interest_rate: number;
  term_months: number;
  repayment_method: 'monthly' | 'quarterly' | 'annually';
  min_amount: number;
  max_amount: number;
  is_active: boolean;
}

export default function LoanProducts() {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/loan-products');
      setProducts(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch loan products');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-600 dark:text-red-400 p-4">Error: {error}</div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Loan Products</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Product
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="mt-2 space-y-2 text-gray-600 dark:text-gray-300">
              <p>Type: {product.product_type}</p>
              <p>Interest Rate: {product.interest_rate}%</p>
              <p>Term: {product.term_months} months</p>
              <p>Repayment: {product.repayment_method}</p>
              <p>Amount Range: ¥{product.min_amount.toLocaleString()} - ¥{product.max_amount.toLocaleString()}</p>
              <p>Status: <span className={`${product.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {product.is_active ? 'Active' : 'Inactive'}
              </span></p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm">
                Edit
              </button>
              <button className={`${product.is_active ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-1 px-3 rounded text-sm`}>
                {product.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
