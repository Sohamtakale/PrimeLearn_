export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-brand-secondary">
            {/* Sidebar Placeholder for Client Wrapper */}
            <div className="w-64 flex-shrink-0 hidden md:block"></div>
            <main className="flex-1 w-full relative">
                {children}
            </main>
        </div>
    );
}
