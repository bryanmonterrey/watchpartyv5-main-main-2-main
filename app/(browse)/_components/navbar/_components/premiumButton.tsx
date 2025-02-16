'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { SubscribeButton } from "@/components/subscribeButton"
import { CryptoPaymentDialog } from "./cryptoPaymentDialog"
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Tabs, Tab } from "@nextui-org/react"
import PopoverWithHint from '@/components/popoverWithHint';
import Logo from '../logo';
import { ArrowUpRight } from 'lucide-react';

interface StripeData {
  customerId: string;
  subscriptionId: string;
  priceId: string;
}

export const PremiumButton = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cryptoChargeId, setCryptoChargeId] = useState('');
    const [selectedTab, setSelectedTab] = useState("card");
    const router = useRouter();

    const handleSubscribeClick = () => {
        setIsPopoverOpen(false);
        setIsDialogOpen(true);
    };

    const handleCryptoClick = async () => {
        if (cryptoChargeId) return;
        try {
            const response = await fetch('/api/create-crypto-charge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 9.99 }), // Set your subscription amount
            });
            if (!response.ok) {
                throw new Error('Failed to create crypto charge');
            }
            const data = await response.json();
            setCryptoChargeId(data.chargeId);
        } catch (error) {
            console.error('Error creating crypto charge:', error);
            toast.error('Failed to create crypto payment. Please try again.');
        }
    };

    const handleSubscriptionComplete = async (stripeData: StripeData) => {
        setIsDialogOpen(false);
        try {
            const response = await fetch('/api/update-subscription-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscribed: true,
                    stripeCustomerId: stripeData.customerId,
                    stripeSubscriptionId: stripeData.subscriptionId,
                    stripePriceId: stripeData.priceId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update subscription status');
            }
            toast.success('Subscription successful!');
            router.refresh();
        } catch (error) {
            console.error('Error updating subscription status:', error);
            toast.error('Failed to update subscription status. Please try again.');
        }
    };

    const handleBack = () => {
        setCryptoChargeId('');
    };

    return (
        <>
            <PopoverWithHint
                triggerContent={
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex h-7 w-7 active:scale-95 text-white/80 group hover:text-white hover:transition-all hover:ease-in-out hover:duration-300 "
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsPopoverOpen(!isPopoverOpen);
                        }}
                    >
                    <ArrowUpRight className='text-inherit h-6 w-6' strokeWidth={2.5}/>
                    </Button>
                }
                popoverContent={
                    <div className='w-[314px]'>
                    <div className='inline-block gap-y-3 space-y-2 '>
                    <div className='flex w-full items-center justify-center pt-2'>
                    <p className='mx-auto text-lg font-semibold'>Upgrade to Premium</p>
                    </div>
                    <Logo />
                    <div className='bg-buttongray/50 rounded-lg py-1 px-1.5 gap-y-1'>
                    <p className='px-1 text-[16px] pb-2 pt-1 text-litepurp'>Premium gives you access to exclusive features, exclusive content, and ad-free streaming.</p>
                    <div className='flex items-end mr-auto pb-1 pt-3 px-1'>
                        <Button variant="primary" className="focus-visible:ring-none ml-auto text-white ring-none h-8 w-full" onClick={handleSubscribeClick}>
                            Subscribe
                        </Button>
                    </div>
                    </div>
                    </div>
                    </div>
                  }
                openLabel="Premium"
                openHintPlacement="bottom-end"
                placement="bottom-end"
                showArrow={true}
                />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <div className='flex m-auto items-center'>
                    <DialogTitle>Upgrade to Premium</DialogTitle>
                    </div>
                    <Tabs 
                        selectedKey={selectedTab} 
                        onSelectionChange={(key) => {
                            setSelectedTab(key as string);
                            if (key === 'crypto') handleCryptoClick();
                        }}
                        className={cn("px-5 m-auto mt-4")}
                    >
                        <Tab key="card" title="Card">
                            <SubscribeButton 
                                priceId="price_1PgpwRKDe4EvwXQZHsQWGUyO"
                                onSubscriptionComplete={handleSubscriptionComplete}
                            />
                        </Tab>
                        <Tab key="crypto" title="Crypto">
                            {cryptoChargeId ? (
                                <CryptoPaymentDialog chargeId={cryptoChargeId} amount={9.99} onBack={handleBack} />
                            ) : (
                                <div className='flex p-6 m-auto items-center'>
                                <Image src="/load.svg" alt="loading" className='animate-spin' width={30} height={30}/>
                                </div>
                            )}
                        </Tab>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    )
}