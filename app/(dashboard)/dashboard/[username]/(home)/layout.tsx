import React from 'react'
import { Container } from '../_components/sidebar/container';
import Sidebar from "../_components/sidebar";

const HomeLayout = ({ 
    children, 
}: {
    children: React.ReactNode;
}) => {
  return (
    <>
        <div className="transition-all flex h-full" >
        <Sidebar />
            <Container>
                {children}
            </Container>
        </ div>
    </>
  )
}

export default HomeLayout