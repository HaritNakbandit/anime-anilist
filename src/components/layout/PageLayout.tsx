import HeaderBar from "./HeaderBar";
import Footer from "./Footer";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <HeaderBar />
      <main className="mt-[64px] flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PageLayout;
