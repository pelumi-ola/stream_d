import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { VideoProvider } from "@/context/VideoContext";
import { DashboardMain } from "@/components/dashboard/dashboardMain";
import { ProtectedRoute } from "@/context/ProtectedRoute";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <VideoProvider>
        <SidebarProvider>
          <div className="flex min-h-screen min-w-full">
            <div className="hidden lg:block">
              <AppSidebar />
            </div>

            <main className="flex-1">
              <div className="block lg:hidden p-2">
                <SidebarTrigger />
              </div>

              <DashboardHeader />

              <div className="flex-1">
                <DashboardMain>
                  <Toaster position="top-center" richColors />
                  {children}
                </DashboardMain>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </VideoProvider>
    </ProtectedRoute>
  );
}
