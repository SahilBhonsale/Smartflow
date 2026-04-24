"use client";

import { useState, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { BoardWithColumns, TaskType, UpdateTaskInput } from "@/types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskModal } from "./TaskModal";
import { CreateTaskModal } from "./CreateTaskModal";
import { useTasks } from "@/hooks/useTasks";
import { Priority } from "@prisma/client";

interface KanbanBoardProps {
  board: BoardWithColumns;
  onBoardUpdate: () => void;
}

export function KanbanBoard({ board, onBoardUpdate }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState({
    id: "",
    name: "",
  });

  const { createTask, updateTask, deleteTask } = useTasks();

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { draggableId, source, destination } = result;
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      // Optimistically update the board
      await updateTask(draggableId, {
        columnId: destination.droppableId,
        order: destination.index,
      });

      // Refresh board data
      onBoardUpdate();
    },
    [updateTask, onBoardUpdate]
  );

  const handleAddTask = (columnId: string, columnName: string) => {
    setActiveColumn({ id: columnId, name: columnName });
    setCreateModalOpen(true);
  };

  const handleTaskClick = (task: TaskType) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    priority: Priority;
    columnId: string;
    boardId: string;
    dueDate?: string;
    tags?: string[];
  }) => {
    await createTask(data);
    onBoardUpdate();
  };

  const handleUpdateTask = async (id: string, data: UpdateTaskInput) => {
    await updateTask(id, data);
    onBoardUpdate();
  };

  const handleDeleteTask = async (id: string) => {
    const success = await deleteTask(id);
    if (success) onBoardUpdate();
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 px-1">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Task Detail/Edit Modal */}
      <TaskModal
        task={selectedTask}
        columns={board.columns}
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        columnId={activeColumn.id}
        boardId={board.id}
        columnName={activeColumn.name}
        onCreateTask={handleCreateTask}
      />
    </>
  );
}
