import DraftPost from "@/components/draft";
import Header from "@/components/header";

const Drafts = () => {
    return (
        <>
            <Header />
            <h1 className="px-4 my-8 text-center text-2xl sm:text-4xl text-primary">
                My Draft Posts
            </h1>
            <div className="rounded-lg shadow-inner px-2 sm:px-4 py-4 m-4">
                <DraftPost />
            </div>
        </>
    );
};

export default Drafts;
