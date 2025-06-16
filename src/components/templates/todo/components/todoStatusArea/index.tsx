import type { Todo } from "@/types/types";
import { TodoBox } from "../todoBox";

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
		<div
			className="p-4 bg-gray-100 border-b w-full overflow-y-auto h-full"
			onDrop={onDrop}
			onDragOver={(e) => e.preventDefault()}
		>
			<div className="text-lg font-semibold mb-3">{status}</div>
			<div className="flex flex-col items-center gap-2">
				{todos.map((todo) => (
					<TodoBox key={todo.id} todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />
				))}
			</div>
		</div>
	);
};
