import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-navy flex items-center justify-between px-6 py-4">
      <h1 className="font-nunito text-xl font-bold text-white md:text-2xl">
        Global Electric Vehicle Tracker
      </h1>
      <Image
        src="/images/logo-dark-bg.png"
        alt="New AutoMotive"
        width={150}
        height={40}
        className="h-auto w-[120px] md:w-[150px]"
        priority
      />
    </header>
  );
}
