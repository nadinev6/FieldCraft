import { PlaceholdersAndVanishInput } from "@/components/PlaceholdersAndVanishInput";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Theme Switcher in top right */}
      <div className="absolute top-8 right-8 z-10">
        <ThemeSwitcher />
      </div>
      
      {/* Main content */}
      <PlaceholdersAndVanishInput
        placeholders={[
          "Welcome to Field Craft",
          "Create a registration form for a work event",
          "Show me an example of a sign-up form",
          "Create an order form for some items",
          "What fields to add to a consent form?"
        ]}
        onChange={(e) => console.log(e.target.value)}
        onSubmit={(e) => console.log("submitted")}
      />
    </div>
  );
}