import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main antialiased min-h-screen flex overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col md:ml-64 h-screen overflow-hidden relative">
                <Outlet />
            </main>
        </div>
    );
}
