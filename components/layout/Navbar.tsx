"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { BsMoon, BsSun } from "react-icons/bs";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <>
      <nav className="w-full h-fit sticky top-0 z-50 backdrop-blur-sm bg-primary/5 dark:bg-black/20 animate-slide-down">
        <div className="container flex-between mx-auto px-4 py-6">
          <Link
            href="/items"
            className="w-1/2 h-full flex items-center justify-start"
          >
            <h1 className="text-3xl font-bold ">Task Website</h1>
          </Link>
          <div className="w-1/2 h-full flex items-center justify-end gap-2 md:gap-4">
            <ThemeToggle />
            {!isAuthPage && <UserProfile />}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

const UserProfile = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return status === "authenticated" ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-10 h-10 cursor-pointer">
          <Image
            src={session?.user?.image || "/user.png"}
            alt="user profile picture"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/5 backdrop-blur-lg">
        <DropdownMenuLabel className="text-md font-semibold capitalize font-marcellus">
          {session?.user?.name || "userName"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Button
            size="sm"
            variant="ghost"
            className="w-full text-red-500 cursor-pointer hover:bg-red-500/70 hover:text-white"
            onClick={() => {
              signOut({ callbackUrl: "/" });
              router.refresh();
            }}
          >
            Sign out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href="/sign-in">
      <Button
        size="sm"
        variant="outline"
        effect="gooeyLeft"
        className="cursor-pointer"
      >
        Sign In
      </Button>
    </Link>
  );
};

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getNextTheme = () => {
    if (theme === "light") return "dark";
    if (theme === "dark") return "system";
    return "light";
  };

  if (!mounted) {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="group overflow-hidden"
      >
        <span className="w-4 h-4 block"></span>
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        title={
          theme === "light"
            ? "Light Theme"
            : theme === "dark"
            ? "Dark Theme"
            : "System Theme"
        }
        onClick={() => setTheme(getNextTheme())}
        className="group overflow-hidden"
      >
        {resolvedTheme === "light" && theme === "light" ? (
          <BsSun className="cursor-pointer group-hover:fill-[orange]" />
        ) : resolvedTheme === "dark" && theme === "dark" ? (
          <BsMoon className="cursor-pointer group-hover:fill-[cyan]" />
        ) : (
          <HiOutlineDesktopComputer className="cursor-pointer group-hover:fill-[gray]" />
        )}
      </Button>
    </>
  );
};
