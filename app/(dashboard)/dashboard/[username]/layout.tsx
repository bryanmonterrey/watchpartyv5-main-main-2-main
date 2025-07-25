import { getSelfByUsername } from "@/lib/auth-service";
import { redirect } from "next/navigation";
import NavBar from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import { Container } from "./_components/container";


interface CreatorLayoutProps {
    params: { username: string };
    children: React.ReactNode;
}

const CreatorLayout = async ({
    params,
    children,
}: CreatorLayoutProps) => {
    const self = await getSelfByUsername(params.username);

    if (!self) {
        redirect("/");
    }

    return (
        <>   
        <NavBar />
            <div className="flex rounded-xl h-[calc(100%-46px)]">
                
                <Container>
                    {children}
                </Container>
            </div>
        </>
    );
}

export default CreatorLayout;