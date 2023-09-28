import React, { useState } from "react";
import { List, Checkbox, Input, Button, TimePicker, Form } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

interface TodoItem {
  id: number;
  content: string;
  time: string;
  checked: boolean;
}

interface TodoListProps {
    todos: TodoItem[];
}

const TodoList: React.FC<TodoListProps> = ({
    todos,
  }) => {
  const [todoList, setTodoList] = useState<TodoItem[]>(todos);
  const timePickerFormat = 'HH:mm';
  const [addTodoForm] = Form.useForm();


  const handleAddTodo = (values: any) => {
    const newTodoItem: TodoItem = {
        id: Math.max(...todoList.map((item) => item.id), 0) + 1,
        content: values.taskContent,
        time: values.taskTime.format("h:mm A"), // Format the time
        checked: false,
      };
    
      const updatedList = [...todoList, newTodoItem];
      setTodoList(updatedList);
    
      // Reset the form fields
      addTodoForm.resetFields();
  };

  const handleDeleteItem = (id: number) => {
    const updatedList = todoList.filter((item) => item.id !== id);
    setTodoList(updatedList);
  }

  const handleCheckboxChange = (id: number) => {
    const updatedList = todoList.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setTodoList(updatedList);
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={todoList}
      renderItem={(item) => (
        <List.Item>
          <div className="w-full flex justify-between">
            <div>
                <h6 className={`mb-0 ${item.checked ? "line-through" : ""}`}>
                {item.content}
                </h6>
                <small className="text-xs leading-tight">{item.time}</small>
            </div>

            <div className="my-auto min-h-6 flex items-center gap-3">
                <Checkbox
                    className="w-5 h-5 ease -ml-7 rounded-1.4 checked:bg-gradient-to-tl checked:from-blue-500 checked:to-violet-500 after:text-xxs after:font-awesome after:duration-250 after:ease-in-out duration-250 relative float-left mt-1 cursor-pointer appearance-none bg-white bg-contain bg-center bg-no-repeat align-top transition-all after:absolute after:flex after:h-full after:w-full after:items-center after:justify-center after:text-white after:opacity-0 after:transition-all after:content-['\f00c'] checked:border-0 checked:border-transparent checked:bg-transparent checked:after:opacity-100"
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(item.id)}
                />

                <Button
                    type="link"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteItem(item.id)}
                />

            </div>
          </div>
        </List.Item>
      )}
      footer={
        <Form
            form={addTodoForm}
            onFinish={handleAddTodo}
        >
            <div className="w-full flex justify-between items-center">
                <div className="w-full">
                    <Form.Item
                    className="w-full h-8"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your task",
                        },
                    ]}
                    name="taskContent"
                >
                    <Input
                        className="w-full"
                        placeholder="New Task"
                    />
                </Form.Item>
              
                <Form.Item
                    className="w-full h-8"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your time",
                        },
                    ]}
                    name="taskTime"
                >
                    <TimePicker className="w-full h-8" format={timePickerFormat}/>
                </Form.Item>
                </div>
                

            <div className="my-auto ml-auto min-h-6">
              <Button
                type="link"
                htmlType="submit"
                icon={<PlusOutlined />}
              />
            </div>
          </div>
        </Form>
      }
    />
  );
};

export default TodoList;

