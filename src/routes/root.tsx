import { Outlet } from "react-router-dom";

export function Root() {
  return (
    <div className="w-full space-y-4" style={{ margin: "0 auto" }}>
      <div className="w-full p-4 bg-white shadow-md">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Bitso Token</h1>
          <button className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-lg">
            Connect
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
