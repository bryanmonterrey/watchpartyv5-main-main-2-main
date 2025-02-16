"use client"

import React from "react"
import { Tabs as NextUITabs, Tab as NextUITab } from "@nextui-org/react"

import { cn } from "@/lib/utils"

interface TabsProps extends Omit<React.ComponentProps<typeof NextUITabs>, 'children'> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const Tabs = React.forwardRef<React.ElementRef<typeof NextUITabs>, TabsProps>(
  ({ defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue);

    const handleSelectionChange = (key: React.Key) => {
      setInternalValue(key.toString());
      if (onValueChange) {
        onValueChange(key.toString());
      }
    };

    const items = React.Children.toArray(children).filter(
      (child): child is React.ReactElement => React.isValidElement(child)
    );

    return (
      <NextUITabs
        ref={ref}
        selectedKey={internalValue}
        onSelectionChange={handleSelectionChange}
        {...props}
      >
        {items.map((item) => (
          <NextUITab key={item.props.value} title={item.props.children}>
            {item.props.children}
          </NextUITab>
        ))}
      </NextUITabs>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-white/5 p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-lightpurp data-[selected]:text-black data-[selected]:shadow-sm",
        className
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, ...props }, ref) => (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };