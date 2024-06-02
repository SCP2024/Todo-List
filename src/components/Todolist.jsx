import { useState, useEffect } from 'react'
import { Button, Input, List, Checkbox, DatePicker, message } from 'antd';
import moment from 'moment';

function TodoList() {
  const [todos, setTodos] = useState(() => {
    const localValue = localStorage.getItem("ITEM");
    if (!localValue) return [];
    try {
      return JSON.parse(localValue);
    } catch (error) {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("ITEM", JSON.stringify(todos));
  }, [todos]);
  //上面的代码实现了将 Todo List 保存在本地 JSON 文件中以实现项目重启后可以保留上次状态。当todos状态变化时，将其保存到localStorage
  const [input, setInput] = useState('');// 存储新待办事项的输入
  const [deadline, setDeadline] = useState(null);// 存储新待办事项的截止日期

  // 处理添加新待办事项的函数
  const handleAddTodo = () => {
    if (input && deadline) {
      setTodos([...todos, { text: input, completed: false, deadline }]);// 添加新todo到列表
      setInput('');
      setDeadline(null);
    } else {
      message.error('请输入正确的待办事项和截止日期');
    }
  };

  // 处理删除待办事项的函数
  const handleDeleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);// 删除指定索引的待办事项
    setTodos(newTodos);// 更新待办事项列表
  };

  // 处理切换待办事项完成状态的函数
  const handleToggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;// 切换完成状态
    setTodos(newTodos);// 更新待办事项列表
  };

  return (
    <div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="请输入待办事项"
      />
      <DatePicker
        value={deadline ? moment(deadline) : null}
        onChange={(date) => setDeadline(date ? date.toISOString() : null)}
        placeholder="请选择截止日期"
      />
      <Button onClick={handleAddTodo} type="primary">
        添加
      </Button>
      <List
        dataSource={todos}
        renderItem={(todo, index) => {
          const isOverdue = moment().isAfter(moment(todo.deadline));
          return (
            <List.Item>
              <Checkbox
                checked={todo.completed}
                onChange={() => handleToggleComplete(index)}
              >
                <div style={{ color: isOverdue ? 'red' : 'white' }}>
                  <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    {todo.text}
                  </span>
                  <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    {moment(todo.deadline).format('YYYY-MM-DD')}
                  </div>
                </div>
              </Checkbox>
              <Button onClick={() => handleDeleteTodo(index)} type="primary">
                删除
              </Button>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default TodoList;