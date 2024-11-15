import { Input } from "@nextui-org/input";

import { SearchIcon } from "@/components/icons";

export const CAsideSearch = () => {
  return (
    <Input
      isClearable
      classNames={{
        label: "text-black/50 dark:text-white/90",
        input: [
          "bg-transparent",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/30",
        ],
        innerWrapper: "bg-transparent",
        inputWrapper: [
          "bg-[#f4f4f5] dark:bg-[#2c2c2c]",
          "group-focus-within:ring-1", // Larger ring size on focus
          "group-focus-within:ring-[#3390ec] dark:group-focus-within:ring-[#8472dc]", // Apply ring color on focus
          "group-focus-within:border-[#3390ec] dark:group-focus-within:border-[#8472dc]", // Focused border color
          "border border-transparent", // Initial border color
          "transition-all", // Smooth transition for border and ring
        ],
      }}
      placeholder="Search"
      radius="full"
      size="lg"
      startContent={
        <SearchIcon className="!w-[1.3em] !h-[1.3em] mb-0.5 mr-2.5 text-default-700/50 dark:text-white/30 text-slate-400 pointer-events-none flex-shrink-0 group-focus-within:text-[#3390ec] dark:group-focus-within:text-[#8472dc]" />
      }
    />
  );
};
