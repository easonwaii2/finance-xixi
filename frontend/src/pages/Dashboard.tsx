export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium">Total Loans</h3>
            <p className="mt-1 text-3xl font-semibold">0</p>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium">Active Applications</h3>
            <p className="mt-1 text-3xl font-semibold">0</p>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium">Pending Approvals</h3>
            <p className="mt-1 text-3xl font-semibold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
