import type { Todo } from "@/types/types";
import { useState } from "react";
import { useTodoDrag } from "@/hooks/useTodoDnD";
import { DetailTodoDialog } from "../DetailTodoDialog";

type TodoBoxProps = {
	todo: Todo;
	updateTodo: (id: number, name: string, detail?: string) => void;
	deleteTodo: (id: number) => void;
};

export const TodoBox = ({ todo, updateTodo, deleteTodo }: TodoBoxProps) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { draggableProps } = useTodoDrag(todo.id);

	return (
		<>
			<button
				className="p-2 min-h-10 w-full mx-1 bg-blue-100 rounded-md cursor-pointer"
				{...draggableProps}
				onClick={() => setIsDialogOpen(true)}
				type="button"
			>
				{todo.name}
			</button>
			<DetailTodoDialog
				todo={todo}
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onUpdate={updateTodo}
				onDelete={deleteTodo}
			/>
		</>
	);
};
