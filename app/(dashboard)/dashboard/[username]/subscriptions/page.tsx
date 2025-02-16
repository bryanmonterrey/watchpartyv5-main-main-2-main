"use client";

import React, { useState } from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import { CancelSubscriptionDialog } from "./_components/cancelSubButton";
import { ChannelSubscriptionsTable } from "./_components/channelSubscriptionsTable";

type TabKey = "channel" | "website";

const SubscriptionPage: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<TabKey>("channel");

    const handleTabChange = (key: React.Key) => {
        if (key === "channel" || key === "website") {
            setSelectedTab(key);
        }
    };

    return (
        <div className="container mx-auto h-screen p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Subscriptions
                </h1>
            </div>
            <Tabs 
                selectedKey={selectedTab} 
                onSelectionChange={handleTabChange}
                aria-label="Subscription types"
            >
                <Tab key="channel" title="Channel Subscriptions" />
                <Tab key="website" title="Website Subscription" />
            </Tabs>
            <div className="mt-4">
                {selectedTab === "channel" && <ChannelSubscriptionsTable />}
                {selectedTab === "website" && (
                    <div className="flex h-full items-center justify-center py-6">
                        <CancelSubscriptionDialog />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionPage;