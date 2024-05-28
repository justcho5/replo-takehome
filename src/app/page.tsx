"use client";

import React, {
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEventHandler,
} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
type Block = {
  id?: number;
  type: "text" | "image";
  value?: string;
  tag?: "p" | "h1" | "h2" | "h3";
  src?: string;
  width?: number;
  height?: number;
};

const Home = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [newBlock, setNewBlock] = useState<Block>({
    type: "text",
    value: "",
    tag: "p",
    src: "",
    width: 200,
    height: 200,
  });

  useEffect(() => {
    fetch("/api/blocks")
      .then((response) => response.json())
      .then((data) => setBlocks(data));
  }, []);

  const addBlock = async () => {
    let blockToAdd: Block;
    if (newBlock.type === "image") {
      const imgResponse = await fetch("/api/saveImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ src: newBlock.src }),
      });
      const data = await imgResponse.json();
      if (imgResponse.ok) {
        blockToAdd = { ...newBlock, src: data.src };
      } else {
        console.error(data.message);
        return;
      }
    } else blockToAdd = { ...newBlock };

    const response = await fetch("/api/blocks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blockToAdd),
    });
    const block = await response.json();
    setBlocks([...blocks, block]);
    setNewBlock({
      type: "text",
      value: "",
      tag: "p",
      src: "",
      width: 200,
      height: 200,
    });
  };

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      addBlock();
    }
  };

  const getBlockElement = (block: Block) => {
    const tag = block.tag || "p";
    const className =
      tag === "h1"
        ? "text-4xl font-bold mb-4"
        : tag === "h2"
        ? "text-3xl font-semibold mb-3"
        : tag === "h3"
        ? "text-2xl font-medium mb-2"
        : "text-base mb-2";

    if (block.type === "text") {
      return React.createElement(tag, { className }, block.value);
    } else {
      return (
        <Image
          className="object-contain"
          src={block.src!}
          width={block.width}
          height={block.height}
          alt="Block Image"
        />
      );
    }
  };
  const newBlockStyle = (tag: string) => {
    const style =
      tag === "h1"
        ? "text-4xl font-bold mb-4"
        : tag === "h2"
        ? "text-3xl font-semibold mb-3"
        : tag === "h3"
        ? "text-2xl font-medium mb-2"
        : "text-base mb-2";
    return style;
  };
  return (
    <div className="container mx-auto p-4 pt-24">
      <h1 className="ml-[168px] text-4xl font-bold mb-4">Notion-Like</h1>
      <div className="space-y-2 ml-[168px]">
        {blocks.map((block, index) => (
          <div key={index} className="pb-2">
            {getBlockElement(block)}
          </div>
        ))}
      </div>

      {/* new block */}
      <div className="mt-4 p-4  flex gap-2">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-16">
                {newBlock.type}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Block Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={newBlock.type}
                onValueChange={(e) =>
                  setNewBlock({
                    ...newBlock,
                    type: e as "text" | "image",
                  })
                }
              >
                <DropdownMenuRadioItem value="text">Text</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="image">
                  Image
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {newBlock.type === "text" ? (
          <div className="flex flex-1 gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-16">
                  {newBlock.tag}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Block Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={newBlock.tag}
                  onValueChange={(e) =>
                    setNewBlock({
                      ...newBlock,
                      tag: e as "p" | "h1" | "h2" | "h3",
                    })
                  }
                >
                  <DropdownMenuRadioItem value="p">
                    Paragraph
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="h1">H1</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="h2">H2</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="h3">H3</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Input
              className={`block mb-4 p-2 border-none rounded flex-1 outline-none ${newBlockStyle(
                newBlock.tag!
              )}`}
              type="text"
              placeholder="Text"
              value={newBlock.value}
              onKeyDown={handleKeyPress}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewBlock({ ...newBlock, value: e.target.value })
              }
            />
          </div>
        ) : (
          <div className="flex flex-1 gap-2">
            <Input
              className="block mb-4 p-2 border rounded w-16"
              type="number"
              placeholder="Width"
              value={newBlock.width}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewBlock({
                  ...newBlock,
                  width: parseInt(e.target.value, 10),
                  height: parseInt(e.target.value, 10),
                })
              }
            />
            <Input
              className="block mb-4 border-none p-2 outline-none"
              type="text"
              placeholder="Image URL"
              value={newBlock.src}
              onKeyDown={handleKeyPress}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewBlock({ ...newBlock, src: e.target.value })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
