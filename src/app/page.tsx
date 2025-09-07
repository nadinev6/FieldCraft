"use client";

import { PlaceholdersAndVanishInput } from "@/ui/placeholders-and-vanish-input"; 
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "Welcome to Field Craft",
    "Create a registration form for a work event",
    "Show me an example of a sign-up form",
    "Create an order form for some items",
    "What fields to add to a consent form?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Craft forms with a prompt
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      <div className="mt-8">
        <Link href="/chat">
          <Button variant="default" size="lg">
            Go to Chat
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Theme Switcher in top right */}
      <div className="absolute top-8 right-8 z-10">
        <ThemeSwitcher />
      </div>
      
      {/* Main content */}
      <PlaceholdersAndVanishInputDemo />
    </div>
  );
}