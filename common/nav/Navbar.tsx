"use client";
import CircleLogo from "@public/circle_logo.png";
import { ConnectKitButton } from "connectkit";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="flex justify-between mx-8 mt-4 h-12 items-center">
      <a href="https://circle.com/" target="_blank">
        <Image className="w-[150px]" src={CircleLogo} alt="CircleLogo" />
      </a>
      <ConnectKitButton />
    </div>
  );
}
