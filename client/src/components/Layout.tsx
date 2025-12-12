import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Kanban, PlusCircle, LogOut } from 'lucide-react';

export const Layout: React.FC = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Kanban, label: 'Board', path: '/board' },
        { icon: PlusCircle, label: 'New Application', path: '/applications/new' },
    ];

    return (
        <div className="flex h-screen bg-background text-slate-800">
            {/* Sidebar */}
            <aside className="w-64 bg-surface border-r border-slate-200 flex flex-col shadow-soft z-10">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                        QA
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">Tracker</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                                ${isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={20}
                                        className={isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}
                                    />
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                    <div className="mt-4 flex items-center gap-3 px-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">Demo User</span>
                            <span className="text-xs text-slate-400">QA Engineer</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
