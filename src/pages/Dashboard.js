import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Dashboard() {

  return (
    <div className="min-h-screen flex flex-col">

      <div className="bg-yellow-300 p-3 text-lg font-semibold">
        DashBord
      </div>
      
      <main className="flex-1 flex items-center justify-center text-2xl font-medium">
        Welcome Admin Panel
      </main>
    </div>
  );
}
