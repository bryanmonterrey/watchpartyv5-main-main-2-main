import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { Hint } from '@/components/hint';

type Placement = "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "right-start" | "right-end";

interface PopoverItem {
  key: string;
  label: string;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | string;
}

interface PopoverWithHintProps {
  triggerContent: React.ReactNode;
  popoverContent?: React.ReactNode;
  items?: PopoverItem[];
  openLabel: string;
  closeLabel?: string;
  openHintPlacement?: Placement;
  closeHintPlacement?: Placement;
  placement?: Placement;
  showArrow?: boolean;
  className?: string;
  onItemSelect?: (key: string) => void;
}

const PopoverWithHint: React.FC<PopoverWithHintProps> = ({
    triggerContent,
    popoverContent,
    items,
    openLabel,
    closeLabel,
    openHintPlacement = "bottom",
    closeHintPlacement = "bottom",
    placement = "bottom",
    showArrow = true,
    className = "",
    onItemSelect
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isContentReady, setIsContentReady] = useState(false);
  
    useEffect(() => {
      console.log("PopoverWithHint mounted");
      const timer = setTimeout(() => {
        setIsContentReady(true);
        console.log("Content ready set to true");
      }, 50);
    
      return () => clearTimeout(timer);
    }, []);
  
    const handleItemClick = (key: string) => {
      console.log("Item clicked:", key);
      if (onItemSelect) {
        onItemSelect(key);
      }
      setIsOpen(false);
    };
  
    const renderContent = () => {
      console.log("Rendering content, items:", items);
      if (items) {
        return (
          <ul className="py-1 gap-y-1 space-y-0.5">
            {items.map((item) => (
              <li
                key={item.key}
                className={`px-4 py-3 gap-y-2 space-y-1 text-white/80 hover:text-white font-medium text-[15px] cursor-pointer hover:bg-buttongray/50 rounded-lg bg-buttongray/20 ${
                  item.color === "danger" ? "text-red-400" : ""
                }`}
                onClick={() => handleItemClick(item.key)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        );
      }
      return popoverContent;
    };
  
    console.log("Popover open state:", isOpen);
  
    return (
      <Popover
        placement={placement}
        showArrow={showArrow}
        isOpen={isOpen}
        onOpenChange={(open) => {
          console.log("Popover open state changed to:", open);
          setIsOpen(open);
        }}
        classNames={{
          base: [
            "before:bg-popblack dark:before:bg-popblack before:rounded-[3px] border-none",
            "before:shadow-none",
          ],
          content: [
            "py-1 px-2 shadow-none rounded-lg border-0",
            "text-white text-[12px] font-medium bg-popblack border-0",
            "transition-opacity duration-150 ease-in-out",
            isContentReady ? "opacity-100 scale-100" : "opacity-0 scale-95",
            "z-[1001]", // Added z-index
            "relative", // Add relative positioning
            "before:absolute before:content-[''] before:inset-0 before:-z-10",
            "before:bg-popblack before:rounded-lg",
            "before:shadow-[0_0_15px_rgba(0,0,0,0.3)]", // Unified shadow
            className
          ],
        }}
      >
        <PopoverTrigger>
          <div onClick={() => console.log("Trigger clicked")}>
            {closeLabel ? (
              <Hint 
                label={isOpen ? closeLabel : openLabel} 
                placement={isOpen ? closeHintPlacement : openHintPlacement}
              >
                {triggerContent}
              </Hint>
            ) : (
              isOpen ? (
                triggerContent
              ) : (
                <Hint 
                  label={openLabel} 
                  placement={openHintPlacement}
                >
                  {triggerContent}
                </Hint>
              )
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          {renderContent()}
        </PopoverContent>
      </Popover>
    );
  };
  
  export default PopoverWithHint;