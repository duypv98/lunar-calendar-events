import LoginForm from "@/components/LoginForm";
import MainCalendar from "@/components/MainCalendar";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import LoadingPage from "@/components/LoadingPage";

export default function Page() {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session?.user;
  // @ts-ignore
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "authenticated") {
      if (userId) {
        // do something with userId
      }
    }
  }, [status, userId]);

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