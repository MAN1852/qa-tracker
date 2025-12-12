import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard: React.FC = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['analytics'],
        queryFn: api.getAnalytics
    });

    if (isLoading) return <div className="p-6">Loading analytics...</div>;
    if (error) return <div className="p-6 text-red-500">Error loading analytics</div>;

    const { totalApps, byStatus, byRole } = data;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Applications</h2>
                    <p className="text-4xl font-bold text-primary mt-2">{totalApps}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Active Roles</h2>
                    <p className="text-4xl font-bold text-accent mt-2">{byRole?.length || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Interviewing</h2>
                    <p className="text-4xl font-bold text-green-500 mt-2">
                        {byStatus.find((s: any) => s.status === 'Technical' || s.status === 'Phone Screen')?.count || 0}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Apps by Status Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Applications by Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={byStatus}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Roles Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 text-gray-800">Applications by Role</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={byRole}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="role"
                            >
                                {byRole.map((_: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
