import { Sidebar } from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';

export default function HomeLayout({ children }) {
    return (
        <>
            <Sidebar />
            <AppLayout>{children}</AppLayout>
        </>
    );
}
