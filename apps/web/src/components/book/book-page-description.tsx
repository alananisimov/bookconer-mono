"use client";
import { useState } from "react";
import { truncate } from "~/lib/utils";

export default function Description({ description }: { description: string }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  return (
    <div>
      <p onClick={() => setIsDescriptionExpanded((value) => !value)}>
        {isDescriptionExpanded ? description : truncate(description, 200)}
      </p>
      <button
        onClick={() => setIsDescriptionExpanded((value) => !value)}
        className="text-start font-medium text-black dark:text-white"
      >
        {isDescriptionExpanded ? "Свернуть" : "Развернуть"}
      </button>
    </div>
  );
}
