import { useState, useEffect } from "react";
import api from "../../services/api";

interface DashboardStats {
  totalLoans: number;
  totalAmount: number;
  approvedLoans: number;
  rejectedLoans: number;
  approvalRate: number;
  totalRepayments: number;
  overdueLoans: number;
  monthlyStats: {
    newLoans: number;
    newLoanAmount: number;
    totalRepayments: number;
    totalCommissions: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [loanStats, repaymentStats, monthlyReport] = await Promise.all([
          api.get("/reports/loan-statistics"),
          api.get("/reports/repayment-statistics"),
          api.get("/reports/monthly-report"),
        ]);

        setStats({
          ...loanStats.data,
          ...repaymentStats.data,
          monthlyStats: monthlyReport.data,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Loans</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalLoans}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Approval Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.approvalRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly New Loans</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.monthlyStats.newLoans}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Overdue Loans</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.overdueLoans}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Monthly Performance</h3>
            <div className="mt-5">
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">New Loan Amount</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {stats.monthlyStats.newLoanAmount}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Repayments</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {stats.monthlyStats.totalRepayments}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Commissions</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {stats.monthlyStats.totalCommissions}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Loan Status Distribution</h3>
            <div className="mt-5">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                      Approved
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-600">
                      {stats.approvedLoans}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                  <div
                    style={{ width: `${(stats.approvedLoans / stats.totalLoans) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  />
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                      Rejected
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-red-600">
                      {stats.rejectedLoans}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                  <div
                    style={{ width: `${(stats.rejectedLoans / stats.totalLoans) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
