import { Component } from "@/components/ui/loader-1";

export default function DemoOne() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse 75% 90% at 50% 50%, #22BA7B 0%, #1A9C6A 45%, #14744F 80%, #0F573B 100%)",
      }}
    >
      <Component size={180} showText={true} />
    </div>
  );
}

export { DemoOne };
