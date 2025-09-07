"use client";
import { PlaceholdersAndVanishInput } from "@/components/PlaceholdersAndVanishInput";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
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