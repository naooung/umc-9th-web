// 1. HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

// 2. TASK의 Type 정의
type Todo = {
    id: number;
    text: string;
    status: 'task' | 'done';
};

let todos: Todo[] = []; 

// 3. TASK 목록 렌더링 함수 
const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    const taskTodos = todos.filter(t => t.status === 'task'); 
    const doneTodos = todos.filter(t => t.status === 'done');

    taskTodos.forEach((todo): void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTodos.forEach((todo): void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};

// 4. TASK 텍스트 입력 처리 함수 (trim 사용)
const getTodoText = (): string => {
    return todoInput.value.trim();
};

// 5. TASK 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text, status: 'task' });
    todoInput.value = '';
    renderTasks();
};

// 6. TASK 상태 변경 (DONE으로 이동)
const completeTodo = (todo: Todo): void => {
    todos = todos.map((t): Todo =>
        t.id === todo.id ? { ...t, status: 'done' } : t
    );
    renderTasks();
};

// 7. DONE 삭제 함수
const deleteTodo = (todo: Todo): void => {
    todos = todos.filter((t): boolean => t.id !== todo.id);
    renderTasks();
};

// 8. TASK 아이템 생성 함수 (완료 여부에 따라 텍스트/색상 설정)
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }

    button.addEventListener('click', (): void => {
        isDone ? deleteTodo(todo) : completeTodo(todo);
    });

    li.appendChild(button);
    return li;
};

// 9. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event: Event): void => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

renderTasks();

/**
 * filter: 배열에서 조건에 맞는 것만 남기고 나머지는 삭제 
 * map: 배열의 모든 요소를 변환하여 새 배열 생성
 * -> 배열을 두개로 관리할 때는 옮기는 과정이 필요해서 filter로 삭제 후에 다른 배열에 push
 * -> 배열을 하나로 관리할 때는 상태만 바꾸면 되므로 map으로 값 변환
 */