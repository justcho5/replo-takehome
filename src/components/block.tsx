import { Block, newBlockStyle } from "@/app/page";
import React, { FormEvent, KeyboardEventHandler, useState } from "react";

type TextBlockProps = {
  block: Block;
  onUpdateBlock: (block: Block) => void;
};
export const TextBlock = ({ block, onUpdateBlock }: TextBlockProps) => {
  const [content, setContent] = useState(block.value);

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      onUpdateBlock({ ...block, value: content });
    }
  };

  const className = newBlockStyle(block.tag || "p");
  return React.createElement(
    block.tag || "p",
    {
      className,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onKeyDown: handleKeyPress,
      onInput: (e: FormEvent<HTMLElement>) =>
        setContent(e.currentTarget.innerText),
    },
    block.value
  );
};
