"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 

export default function Navbar() {
  const { isLoggedIn, logout, user } = useAuthStore();
  const router = useRouter();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="text-xl font-bold">
        AI Gen
      </Link>
      <div className="flex items-center gap-4">
        {isClient && (
          <>
            {isLoggedIn() ? (
              <>
                <span className="text-sm text-gray-400">{user?.email}</span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}