import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Todo } from "@/types/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type DetailTodoDialogProps = {
	todo: Todo;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onDelete: (id: number) => void;
	onUpdate: (id: number, name: string, detail?: string) => void;
};

type FormValues = {
	name: string;
	detail?: string;
};

export const DetailTodoDialog = ({ todo, isOpen, onOpenChange, onDelete, onUpdate }: DetailTodoDialogProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			name: todo.name,
			detail: todo.details,
		},
		mode: "onBlur",
	});
	const onSubmit = (data: FormValues) => {
		onUpdate(todo.id, data.name, data.detail);
		reset();
		onOpenChange(false);
	};
	const onClickDelete = () => {
		onDelete(todo.id);
		reset();
		onOpenChange(false);
	};
	useEffect(() => {
		if (isOpen) {
			reset({
				name: todo.name,
				detail: todo.details,
			});
		}
	}, [todo, isOpen, reset]);
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{todo.name}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Todo Name
							</Label>
							<Input id="todo_name" className="col-span-3" {...register("name", { required: "todo nameは必須です" })} />
							<p className="text-red-500 col-span-4">{errors.name?.message}</p>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Todo Detail
							</Label>
							<Input id="todo_detail" className="col-span-3" {...register("detail")} />
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" name="update">
							更新
						</Button>
						<Button type="button" name="delete" variant={"destructive"} onClick={onClickDelete}>
							削除
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
