import type { Todo } from "@/types/types";
import type React from "react";
import { TodoBox } from "../TodoBox";

type TodoStatusAreaProps = {
	status: "not-started" | "doing" | "done";
	todos: Todo[];
	updateStatus: (id: number, newStatus: Todo["status"]) => void;
	updateTodo: (id: number, name: string, detail?: string) => void;
	deleteTodo: (id: number) => void;
};

export const TodoStatusArea = ({ status, todos, updateStatus, updateTodo, deleteTodo }: TodoStatusAreaProps) => {
	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		const id = Number.parseInt(e.dataTransfer.getData("text/plain"));
		const newStatus = status;
		if (Number.isNaN(id)) {
			return;
		}
		updateStatus(id, newStatus);
		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<section
			className="p-4 bg-gray-100 border-b w-full overflow-y-auto h-full"
			onDrop={onDrop}
			onDragOver={(e) => e.preventDefault()}
			data-testid={status}
		>
			<h2 className="text-lg font-semibold mb-3">{status}</h2>
			<ul className="flex flex-col items-center gap-2">
				{todos.map((todo) => (
					<li key={todo.id} className="w-full" data-testid="todoBox">
						<TodoBox todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />
					</li>
				))}
			</ul>
		</section>
	);
};
