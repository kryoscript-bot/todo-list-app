// ==========================================
// TO-DO LIST APP - JAVASCRIPT
// Local Storage Functionality
// ==========================================

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.render();
    }

    // ==========================================
    // LOCAL STORAGE FUNCTIONS
    // ==========================================

    loadFromStorage() {
        const stored = localStorage.getItem('todos');
        this.todos = stored ? JSON.parse(stored) : [];
    }

    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    // ==========================================
    // CRUD OPERATIONS
    // ==========================================

    addTodo(text) {
        if (!text.trim()) {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.todos.unshift(todo);
        this.saveToStorage();
        this.render();
        this.clearInput();
    }

    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveToStorage();
            this.render();
        }
    }

    updateTodo(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = newText.trim();
            this.saveToStorage();
            this.render();
            this.editingId = null;
        }
    }

    toggleComplete(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    // ==========================================
    // FILTER OPERATIONS
    // ==========================================

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.updateFilterButtons();
        this.render();
    }

    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === this.currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    // ==========================================
    // STATISTICS
    // ==========================================

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('remainingTasks').textContent = remaining;
    }

    // ==========================================
    // CLEAR OPERATIONS
    // ==========================================

    clearCompleted() {
        const count = this.todos.filter(t => t.completed).length;
        if (count === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm(`Clear ${count} completed task(s)?`)) {
            this.todos = this.todos.filter(todo => !todo.completed);
            this.saveToStorage();
            this.render();
        }
    }

    clearAll() {
        if (this.todos.length === 0) {
            alert('No tasks to clear!');
            return;
        }

        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
            this.todos = [];
            this.saveToStorage();
            this.render();
        }
    }

    // ==========================================
    // UI OPERATIONS
    // ==========================================

    clearInput() {
        document.getElementById('todoInput').value = '';
        document.getElementById('todoInput').focus();
    }

    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        div.innerHTML = `
            <input 
                type="checkbox" 
                class="checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="app.toggleComplete(${todo.id})"
            >
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="edit-btn" onclick="app.startEdit(${todo.id})">✏️ Edit</button>
                <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">🗑️ Delete</button>
            </div>
        `;
        return div;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    startEdit(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const newText = prompt('Edit your task:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            this.updateTodo(id, newText);
        }
    }

    // ==========================================
    // RENDERING
    // ==========================================

    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            todoList.innerHTML = '<div class="empty-state">🎉 No tasks yet. Add one to get started!</div>';
        } else {
            filteredTodos.forEach(todo => {
                todoList.appendChild(this.createTodoElement(todo));
            });
        }

        this.updateStats();
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================

    setupEventListeners() {
        // Add button
        document.getElementById('addBtn').addEventListener('click', () => {
            const input = document.getElementById('todoInput');
            this.addTodo(input.value);
        });

        // Enter key to add
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const input = document.getElementById('todoInput');
                this.addTodo(input.value);
            }
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
            });
        });

        // Clear buttons
        document.getElementById('clearCompletedBtn').addEventListener('click', () => {
            this.clearCompleted();
        });

        document.getElementById('clearAllBtn').addEventListener('click', () => {
            this.clearAll();
        });
    }
}

// ==========================================
// INITIALIZE APP
// ==========================================

const app = new TodoApp();
