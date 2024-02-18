"use client";
import AutoComplete from "@/components/AutoComplete";
import Switch from "@/components/Switch";
import { useState } from "react";

export default function Home() {
  const [checked, setChecked] = useState<boolean>(false);

  const handleOnChange = (value: boolean) => {
    setChecked(value);
  };

  return (
    <main className="flex min-h-screen flex-col px-10 py-24 ">
      <Switch label="Search using a real API Rest" onChange={handleOnChange} />
      <AutoComplete getFromApi={checked} />
    </main>
  );
}
