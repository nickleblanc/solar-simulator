import { SideBar } from "@/components/SideBar";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="flex h-screen min-h-screen flex-row">
      <div className="pl-4 pt-4 w-[300px] h-full">
        <SideBar />
      </div>
      <div className="w-full pl-4">
        <Dashboard />
      </div>
    </main>
  );
}
