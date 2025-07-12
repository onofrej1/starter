//import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
//import { Navbar } from "@/components/admin-panel/navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import UserNav from "@/components/layout/user-nav";
import { Input } from "@/components/ui/input";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex justify-between p-3  border-b">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <Breadcrumb />
          </div>
          <div className="flex gap-2">
            <Input placeholder="Search" />
            <UserNav />
          </div>
        </div>
        <div className="p-3">{children}</div>
      </main>
    </SidebarProvider>
  );
}
