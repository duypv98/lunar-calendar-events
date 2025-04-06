import Header from "@/components/Header";
import LoadingPage from "@/components/LoadingPage";
import LoginForm from "@/components/LoginForm";
import MainCalendar from "@/components/MainCalendar";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user;

  const renderView = () => {
    if (status === "loading") {
      return <LoadingPage />;
    }
    if (!isLoggedIn) return <LoginForm />;
    return <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col mx-auto md:h-screen lg:py-0">
        <div>
          <Header />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <MainCalendar />
        </div>
      </div>
    </section>;
  }

  return <>
    {renderView()}
  </>
}