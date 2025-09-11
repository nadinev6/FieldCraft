"use client";
import { useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "@/components/PlaceholdersAndVanishInput";
import { ThemeSwitcher } from "@/components/theme-switcher";


export default function Home() {
  const router = useRouter();

  const handleSubmit = () => {
    console.log("handleSubmit called - navigating to /chat");
    console.log("handleSubmit called - navigating to /chat");
    router.push("/chat");
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#7FFFC3]/25 via-transparent to-transparent">
      {/* Theme Switcher - now draggable */}
      <ThemeSwitcher />
      

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center space-y-10 sm:space-y-20 max-w-4xl w-full px-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-center dark:text-white text-black">
          Craft Forms with AI
        </h1>

        
        <div className="w-full max-w-2xl mx-auto">
          <PlaceholdersAndVanishInput
            placeholders={[
              "Welcome to Field Craft",
              "Create a registration form for a work event",
              "Show me an example of a sign-up form",
              "Create an order form for some items",
              "What fields to add to a consent form?"
            ]}
            onChange={(value) => console.log(value)}
            onSubmit={handleSubmit}
            className="w-full h-14" 
            inputClassName="text-lg py-3"
          />
        </div>
      </div>
    </div>
  );
}