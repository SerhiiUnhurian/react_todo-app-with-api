/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { TodoLoader } from './TodoLoader';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  loadingTodoIds: Set<number>;
  onToggle: (todo: Todo) => void;
  editTodo: (todo: Todo, newTodoTitle: string) => void;
  titleEditingId: number | null;
  setTitleEditingId: (id: number | null) => void;
  errorMessage: string;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  loadingTodoIds,
  onToggle,
  editTodo,
  titleEditingId,
  setTitleEditingId,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [titleEditingId]);

  const handleDoubleClick = (todo: Todo) => {
    setTitleEditingId(todo.id);
    setNewTodoTitle(todo.title);
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) => {
    event.preventDefault();
    editTodo(todo, newTodoTitle.trim());
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const { id, title, completed } = todo;

        return (
          <div
            data-cy="Todo"
            className={classNames('todo', {
              completed: completed,
            })}
            key={id}
          >
            <label className="todo__status-label" htmlFor={`todoStatus-${id}`}>
              <input
                id={`todoStatus-${id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={completed}
                onChange={() => onToggle(todo)}
              />
            </label>
            {titleEditingId === id ? (
              <form
                onSubmit={event => handleSubmit(event, todo)}
                onBlur={event => handleSubmit(event, todo)}
                onKeyUp={event => {
                  if (event.key === 'Escape') {
                    setTitleEditingId(null);
                  }
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={newTodoTitle}
                  onChange={event => setNewTodoTitle(event.target.value)}
                  ref={titleInputRef}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(todo)}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => onDeleteTodo(id)}
                >
                  ×
                </button>
              </>
            )}
            {/* overlay will cover the todo while it is being deleted or updated */}
            <TodoLoader loadingTodoIds={loadingTodoIds} todoId={id} />
          </div>
        );
      })}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
        >
          <label
            className="todo__status-label"
            htmlFor={`todoStatus-${tempTodo.id}`}
          >
            <input
              id={`todoStatus-${tempTodo.id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              // defaultChecked={tempTodo.completed}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          {/* overlay will cover the todo while it is being deleted or updated */}
          <TodoLoader loadingTodoIds={loadingTodoIds} todoId={0} />
        </div>
      )}

      {/* This todo is being edited */}
      {/* <div data-cy="Todo" className="todo"> */}
      {/* <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label> */}

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
          <input
            data-cy="newTodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div> */}
      {/* </div> */}

      {/* This todo is in loadind state */}
      {/* <div data-cy="Todo" className="todo"> */}
      {/* <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="newTodoTitle" className="todo__title">
          Todo is being saved now
        </span>

        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button> */}
    </section>
  );
};
