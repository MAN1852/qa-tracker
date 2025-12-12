import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ArrowLeft, Save } from 'lucide-react';

export const ApplicationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<any>({});

    const isNew = id === 'new';

    const { data: application, isLoading, isError } = useQuery({
        queryKey: ['application', id],
        queryFn: async () => {
            if (isNew) return null;
            const apps = await api.getApplications();
            return apps.find((a: any) => a.id === id);
        },
        enabled: !isNew && !!id
    });

    // Sync data to form when loaded
    React.useEffect(() => {
        if (application) {
            setFormData(application);
        } else if (isNew) {
            setFormData({
                status: 'Applied',
                priority: 'Medium',
                roleType: 'QA Engineer', // Default
                jobTitle: '',
                company: ''
            });
        }
    }, [application, isNew]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => api.updateApplication(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            alert('Saved!');
        }
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => api.createApplication(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            alert('Created!');
            navigate('/board');
        }
    });

    if (isLoading) return <div className="p-6">Loading...</div>;
    if (!isNew && (isError || !application)) return <div className="p-6">Application not found</div>;

    const handleSave = () => {
        if (isNew) {
            createMutation.mutate(formData);
        } else {
            updateMutation.mutate(formData);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-primary">
                    <ArrowLeft className="mr-2" size={20} /> Back
                </button>
                <div className="flex gap-2">
                    <button onClick={handleSave} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                        <Save className="mr-2" size={18} /> Save Changes
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={formData.jobTitle || ''}
                            onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={formData.company || ''}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={formData.status || ''}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            {['Applied', 'Phone Screen', 'Technical', 'Offer', 'Rejected'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={formData.priority || ''}
                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                        >
                            {['Low', 'Medium', 'High'].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">HR Email</label>
                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={formData.contactEmail || ''}
                            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                            placeholder="hr@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">HR Phone</label>
                        <input
                            type="tel"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={formData.contactPhone || ''}
                            onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>

                {/* Dynamic Role Fields */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Role Specific Requirements ({formData.roleType})</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm text-gray-600 overflow-auto">
                            {/* Basic JSON editor for now */}
                            {JSON.stringify(formData.requiredFields, null, 2)}
                        </pre>
                    </div>
                </div>

                {/* Notes Section Placeholder */}
                <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Notes & Interviews</h3>
                    <p className="text-gray-500 italic">Interview tracking implementation pending...</p>
                </div>
            </div>
        </div>
    );
};
