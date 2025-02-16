import { create } from "zustand";

export enum ChannelToolVariant {
    CHAT = "CHAT",
    COMMUNITY = "COMMUNITY"
};

interface ChannelToolStore {
    collapsed: boolean;
    variant: ChannelToolVariant;
    onExpand: () => void;
    onCollapse: () => void;
    onChangeVariant: (variant: ChannelToolVariant) => void;
};



export const useChannelTool = create <ChannelToolStore>((set) => ({
    collapsed: false,
    variant: ChannelToolVariant.CHAT,
    onChangeVariant: (variant: ChannelToolVariant) => set(() => ({ variant })),
    onExpand: () => set(() => ({ collapsed: false })),
    onCollapse: () => set(() => ({ collapsed: true })), 
  }));

