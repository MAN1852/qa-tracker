import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { api } from '../api';
import type { Application } from '../types';
import { MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const COLUMNS = ['Applied', 'Phone Screen', 'Technical', 'Offer', 'Rejected'];

export const ApplicationBoard: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['applications'],
        queryFn: api.getApplications
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            api.updateApplication(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        }
    });

    const columns = useMemo(() => {
        const cols: Record<string, Application[]> = {};
        COLUMNS.forEach(c => cols[c] = []);
        applications.forEach(app => {
            if (cols[app.status]) {
                cols[app.status].push(app);
            } else {
                // Handle unknown status or just push to Applied
                if (!cols['Applied']) cols['Applied'] = [];
                cols['Applied'].push(app);
            }
        });
        return cols;
    }, [applications]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;
        updateMutation.mutate({ id: draggableId, status: newStatus });
    };

    if (isLoading) return <div className="p-6">Loading board...</div>;

    return (
        <div className="p-6 h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Application Board</h1>
                {/* Filter placeholders could go here */}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto h-full pb-4">
                    {COLUMNS.map(columnId => (
                        <div key={columnId} className="min-w-[300px] bg-gray-100 rounded-lg flex flex-col max-h-full">
                            <div className="p-4 border-b border-gray-200 font-semibold text-gray-700 flex justify-between">
                                {columnId}
                                <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-500 border border-gray-200">
                                    {columns[columnId]?.length || 0}
                                </span>
                            </div>

                            <Droppable droppableId={columnId}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 p-3 overflow-y-auto min-h-[100px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50' : ''
                                            }`}
                                    >
                                        {columns[columnId]?.map((app, index) => (
                                            <Draggable key={app.id} draggableId={app.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow cursor-move ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary ring-opacity-50' : ''
                                                            }`}
                                                        onClick={() => navigate(`/applications/${app.id}`)}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="font-bold text-gray-800 line-clamp-1">{app.jobTitle}</h3>
                                                            {app.priority === 'High' && <span className="w-2 h-2 rounded-full bg-red-500" title="High Priority" />}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">{app.company}</p>

                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                                            <MapPin size={12} /> {app.location}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <DollarSign size={12} />
                                                            {app.salaryMin ? `${(app.salaryMin / 1000).toFixed(0)}k` : 'N/A'} -
                                                            {app.salaryMax ? `${(app.salaryMax / 1000).toFixed(0)}k` : 'N/A'}
                                                        </div>

                                                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                                            <span className={`text-xs px-2 py-1 rounded bg-blue-50 text-blue-700`}>
                                                                {app.roleType}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {format(new Date(app.updatedAt), 'MMM d')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};
