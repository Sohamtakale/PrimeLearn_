import { Sidebar } from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';

export default function EpisodeLayout({ children }) {
    return (
        <>
            <Sidebar />
            <AppLayout>{children}</AppLayout>
        </>
    );
}
