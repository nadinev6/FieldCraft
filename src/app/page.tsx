"use client";
import { PlaceholdersAndVanishInput } from "@/components/PlaceholdersAndVanishInput";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center relative">
      {/* Theme Switcher in top-right corner */}
      <div className="absolute top-8 right-8 z-10">
        <ThemeSwitcher />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center space-y-10 sm:space-y-20">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-center dark:text-white text-black">
          Craft Forms with AI
        </h1>
        
        <PlaceholdersAndVanishInput
          placeholders={[
            "Welcome to Field Craft",
            "Create a registration form for a work event",
            "Show me an example of a sign-up form",
            "Create an order form for some items",
            "What fields to add to a consent form?"
          ]}
          onChange={(e) => console.log(e.target.value)}
          onSubmit={() => console.log("submitted")}
        />
      </div>
    </div>
  );
}
      <PlaceholdersAndVanishInput
        placeholders={[
          "Welcome to Field Craft",
          "Create a registration form for a work event",
          "Show me an example of a sign-up form",
          "Create an order form for some items",
          "What fields to add to a consent form?"
        ]}
        onChange={(e) => console.log(e.target.value)}
        onSubmit={() => console.log("submitted")}
      />
    </div>
  );
}