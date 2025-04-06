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
    if (isLoggedIn) return <MainCalendar />;
    return <LoginForm />;
  }

  return <>
    {renderView()}
  </>
}