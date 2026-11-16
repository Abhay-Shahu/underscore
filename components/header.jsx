import { checkUser } from "@/lib/checkUser";
import { Button } from "./ui/button";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import RoleRedirect from "./RoleRedirect";
import CreditButton from "./CreditButton";
import { CalendarDays, Users } from "lucide-react";

const Header = async () => {
  const user = await checkUser();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-3 sm:px-10 py-3 border-b border-white/7 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-[#1c1812] to-[#0d0d0f] border border-amber-400/35 flex items-center justify-center shadow-[0_0_16px_rgba(251,191,36,0.18)] group-hover:border-amber-400/70 group-hover:shadow-[0_0_22px_rgba(251,191,36,0.35)] transition-all">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform transition-transform group-hover:scale-105"
          >
            <path
              d="M6 3.5V12.5C6 15.8 8.68 18.5 12 18.5C15.32 18.5 18 15.8 18 12.5V3.5"
              stroke="url(#u_amber_gradient)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="7"
              y1="22"
              x2="17"
              y2="22"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="u_amber_gradient"
                x1="6"
                y1="3.5"
                x2="18"
                y2="18.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fef3c7" />
                <stop offset="0.5" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="font-serif text-xl tracking-tight text-white flex items-center">
          Underscore<span className="text-amber-400 font-mono text-lg animate-pulse ml-0.5">_</span>
        </span>
      </Link>

      {user && <RoleRedirect role={user.role} />}

      <div className="flex items-center gap-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          <SignInButton mode="modal">
            <Button variant="gold">Get started →</Button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          {user?.role === "INTERVIEWER" && (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {user?.role === "INTERVIEWEE" && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/explore">
                  <Users size={16} />
                  <span className="hidden md:inline">Explore</span>
                </Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/appointments">
                  <CalendarDays size={16} />
                  <span className="hidden md:inline">My Appointments</span>
                </Link>
              </Button>
            </>
          )}

          <CreditButton
            role={user?.role === "INTERVIEWER" ? "INTERVIEWER" : "INTERVIEWEE"}
            credits={
              (user?.role === "INTERVIEWER"
                ? user?.creditBalance
                : user?.credits) ?? 0
            }
          />

          <UserButton />
        </Show>
      </div>
    </nav>
  );
};

export default Header;
