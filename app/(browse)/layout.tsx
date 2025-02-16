import React from 'react'
import NavBar from './_components/navbar';
import Sidebar, { SidebarSkeleton} from './_components/sidebar';
import { Container } from './_components/container';
import { Suspense } from'react';

const BrowseLayout = ({ 
    children, 
}: {
    children: React.ReactNode;
}) => {
  return (
    <>
    <NavBar />
        <div className="transition-all hidden-scrollbar flex h-full pt-[46px]" >
            <Suspense fallback={<SidebarSkeleton />}>
                <Sidebar />
            </Suspense>
            <Container>
                {children}
            </Container>
        </ div>
    </>
  )
}

export default BrowseLayout