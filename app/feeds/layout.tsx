import SideNav from "@/components/side-nav";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex">
            <SideNav />
            {children}
        </div>
    );
};

export default Layout;
