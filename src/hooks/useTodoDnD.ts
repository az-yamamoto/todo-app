import { useCallback } from 'react'
import type { Todo } from '@/types/types'

type UseTodoDnDOptions = {
  todoId?: number
  targetStatus?: Todo['status']
  onTodoDropped?: (todoId: number, newStatus: Todo['status']) => void
}

export function useTodoDnD(options: UseTodoDnDOptions = {}) {
  const { todoId, targetStatus, onTodoDropped } = options

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (todoId === undefined) {
        console.error('ID が不正です')
        return
      }
      event.dataTransfer.setData('text/plain', String(todoId))
    },
    [todoId]
  )

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()

      if (targetStatus === undefined || onTodoDropped === undefined) {
        console.error('不正な状態です')
        return
      }

      const todoIdString = event.dataTransfer.getData('text/plain')
      const draggedTodoId = Number.parseInt(todoIdString, 10)

      if (Number.isNaN(draggedTodoId)) {
        console.error('ID が不正です:', todoIdString)
        return
      }

      onTodoDropped(draggedTodoId, targetStatus)
    },
    [targetStatus, onTodoDropped]
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  return {
    handleDragStart,
    draggableProps: {
      draggable: todoId !== undefined,
      onDragStart: handleDragStart,
    },
    handleDrop,
    handleDragOver,
    dropZoneProps: {
      onDrop: handleDrop,
      onDragOver: handleDragOver,
    },
  }
}

export function useTodoDrag(todoId: number) {
  return useTodoDnD({ todoId })
}

export function useTodoDrop(
  targetStatus: Todo['status'],
  onTodoDropped: (todoId: number, newStatus: Todo['status']) => void
) {
  return useTodoDnD({ targetStatus, onTodoDropped })
}
