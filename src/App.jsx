import React, { useEffect, useState } from "react";
import "animate.css";
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Tag,
} from "antd";
import { Delete, Plus, Edit } from "lucide-react";
import { usePlanner } from "./store/usePlanner";
import moment from "moment";

const App = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [timer, setTimer] = useState(new Date().toLocaleTimeString());

  const {
    tasks,
    addTask,
    deleteTask,
    updateStatus,
    deleteAllTask,
    updateTask,
  } = usePlanner();

  const highestTask = tasks.filter((item) => item.priority === "highest");
  const mediumTask = tasks.filter((item) => item.priority === "medium");
  const lowestTask = tasks.filter((item) => item.priority === "lowest");

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "inProgress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const createTask = (value) => {
    value.status = "pending";
    value.id = Date.now();
    value.createAt = new Date();
    addTask(value);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleEditOpen = (task) => {
    setEditTask(task);
    setEditOpen(true);
    form.setFieldsValue(task);
  };

  const handleEditSubmit = (value) => {
    updateTask(editTask.id, { ...editTask, ...value });
    setEditOpen(false);
    setEditTask(null);
    form.resetFields();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(new Date().toLocaleTimeString());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-gray-100 h-screen overflow-hidden">
      <nav className="bg-gradient-to-r from-red-500 via-slate-800 to-sky-900 text-white bg-white h-[60px] fixed top-0 left-0 w-full flex justify-between items-center px-8">
        <div className="flex items-center">
          <button className="w-10 h-10 bg-[radial-gradient(circle_at_center,_#00c6ff_0%,_#0072ff_50%,_hsl(275.8,_76.51774029159617%,_47.20364378030262%)_100%)] rounded-full font-bold text-white">
            PL
          </button>
          <h1 className="text-2xl font-bold ml-px">anner</h1>
        </div>
        <div className="flex items-center gap-5">
          <DatePicker className="!py-1.5" />
          <h1 className="text-2xl font-bold lg:block hidden">{timer}</h1>
          <button
            onClick={() => setOpen(true)}
            className="focus:shadow-lg hover:scale-105 transition-translate duration-300 items-center py-2 px-3 text-sm rounded-lg bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-600 text-white flex gep-1 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
          <Popconfirm
            title="Dou You Want to delete All task ? "
            onConfirm={() => deleteAllTask()}
            okText="Yes"
            cancelText="No"
          >
            <button className="focus:shadow-lg hover:scale-105 transition-translate duration-300 items-center py-2 px-3 text-sm rounded-lg bg-gradient-to-tr from-rose-600 via-red-500 to-rose-600 text-white flex gep-1 font-medium">
              <Delete className="w-4 h-4" />
              Delete All 
            </button>
          </Popconfirm>
        </div>
      </nav>

      <section className="fixed top-[60px] left-0 h-[calc(100%-120px)] w-full overflow-x-auto overflow-y-visible grid lg:grid-cols-3 gap-8 p-8">
        {/* Highest */}
        <div className="lg:h-full lg:min-h-0 h-[300px]">
          <Badge.Ribbon
            text="Highest"
            className="!bg-gradient-to-br !from-rose-500 !via-pink-500 !to-rose-500 !font-medium !z-[20000]"
          />
          <div className="bg-white rounded-lg h-full min-h-0 overflow-auto p-6 space-y-8">
            <div className="flex flex-col gap-4">
              {highestTask.length === 0 && (
                <>
                  <Empty description="There is No Added as Highest priority" />
                  <button
                    onClick={() => setOpen(true)}
                    className="w-fit mx-auto focus:shadow-lg hover:scale-105 transition-translate duration-300 items-center py-2 px-3 text-sm rounded-lg bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-600 text-white flex gep-1 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </>
              )}
              {highestTask.map((item, index) => (
                <Card hoverable key={index}>
                  <Card.Meta
                    title={item.title}
                    description={item.description}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      {item.status === "pending" && (
                        <Tag className="capitalize">{item.status}</Tag>
                      )}
                      {item.status === "inProgress" && (
                        <Tag className="capitalize" color="geekblue">
                          {item.status}
                        </Tag>
                      )}
                      {item.status === "completed" && (
                        <Tag className="capitalize" color="green">
                          {item.status}
                        </Tag>
                      )}
                      <Popconfirm
                        title="Dou You Want to delete task ? "
                        onConfirm={() => deleteTask(item.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Tag className="!bg-rose-500 !border-rose-500 !text-white cursor-pointer">
                          Delete
                        </Tag>
                      </Popconfirm>
                      <Tag
                        className="!bg-indigo-500 !border-indigo-500 !text-white cursor-pointer"
                        onClick={() => handleEditOpen(item)}
                      >
                        <Edit className="w-3 h-3 inline-block mr-1" /> Edit
                      </Tag>
                    </div>
                    <Select
                      size="small"
                      placeholder="Update Status"
                      onChange={(status) => updateStatus(item.id, status)}
                    >
                      <Select.Option value="pending">Pending</Select.Option>
                      <Select.Option value="inProgress">
                        inProgress
                      </Select.Option>
                      <Select.Option value="completed">Completed</Select.Option>
                    </Select>
                  </div>
                  <label className="text-slate-600 text-sm flex mt-3">
                    {moment(item.createAt).format("DD MMM YYYY hh:mm A")}
                  </label>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Medium */}
        <div className="lg:h-full lg:min-h-0 h-[300px]">
          <Badge.Ribbon
            text="Medium"
            className="!bg-gradient-to-br !from-indigo-500 !via-blue-500 !to-indigo-500 !font-medium !z-[20000]"
          />
          <div className="bg-white rounded-lg h-full min-h-0 overflow-auto p-6 space-y-8">
            <div className="flex flex-col gap-4">
              {mediumTask.length === 0 && (
                <>
                  <Empty description="There is No Added as Medium priority" />
                  <button
                    onClick={() => setOpen(true)}
                    className="w-fit mx-auto focus:shadow-lg hover:scale-105 transition-translate duration-300 items-center py-2 px-3 text-sm rounded-lg bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-600 text-white flex gep-1 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </>
              )}
              {mediumTask.map((item, index) => (
                <Card hoverable key={index}>
                  <Card.Meta
                    title={item.title}
                    description={item.description}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      {item.status === "pending" && (
                        <Tag className="capitalize">{item.status}</Tag>
                      )}
                      {item.status === "inProgress" && (
                        <Tag className="capitalize" color="geekblue">
                          {item.status}
                        </Tag>
                      )}
                      {item.status === "completed" && (
                        <Tag className="capitalize" color="green">
                          {item.status}
                        </Tag>
                      )}
                      <Popconfirm
                        title="Dou You Want to delete  task ? "
                        onConfirm={() => deleteTask(item.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Tag className="!bg-rose-500 !border-rose-500 !text-white cursor-pointer">
                          Delete
                        </Tag>
                      </Popconfirm>
                      <Tag
                        className="!bg-indigo-500 !border-indigo-500 !text-white cursor-pointer"
                        onClick={() => handleEditOpen(item)}
                      >
                        <Edit className="w-3 h-3 inline-block mr-1" /> Edit
                      </Tag>
                    </div>
                    <Select
                      size="small"
                      placeholder="Update Status"
                      onChange={(status) => updateStatus(item.id, status)}
                    >
                      <Select.Option value="pending">Pending</Select.Option>
                      <Select.Option value="inProgress">
                        inProgress
                      </Select.Option>
                      <Select.Option value="completed">Completed</Select.Option>
                    </Select>
                  </div>
                  <label className="text-slate-600 text-sm flex mt-3">
                    {moment(item.createAt).format("DD MMM YYYY hh:mm A")}
                  </label>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Lowest */}
        <div className="lg:h-full lg:min-h-0 h-[300px]">
          <Badge.Ribbon
            text="Lowest"
            className="!bg-gradient-to-br !from-amber-500 !via-orange-500 !to-amber-500 !font-medium !z-[20000]"
          />
          <div className="bg-white rounded-lg h-full min-h-0 overflow-auto p-6 space-y-8">
            <div className="flex flex-col gap-4">
              {lowestTask.length === 0 && (
                <>
                  <Empty description="There is No Added as lowest priority " />
                  <button
                    onClick={() => setOpen(true)}
                    className="w-fit mx-auto focus:shadow-lg hover:scale-105 transition-translate duration-300 items-center py-2 px-3 text-sm rounded-lg bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-600 text-white flex gep-1 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </button>
                </>
              )}
              {lowestTask.map((item, index) => (
                <Card hoverable key={index}>
                  <Card.Meta
                    title={item.title}
                    description={item.description}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      {item.status === "pending" && (
                        <Tag className="capitalize">{item.status}</Tag>
                      )}
                      {item.status === "inProgress" && (
                        <Tag className="capitalize" color="geekblue">
                          {item.status}
                        </Tag>
                      )}
                      {item.status === "completed" && (
                        <Tag className="capitalize" color="green">
                          {item.status}
                        </Tag>
                      )}
                      <Popconfirm
                        title="Dou You Want to delete  task ? "
                        onConfirm={() => deleteTask(item.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Tag className="!bg-rose-500 !border-rose-500 !text-white cursor-pointer">
                          Delete
                        </Tag>
                      </Popconfirm>
                      <Tag
                        className="!bg-indigo-500 !border-indigo-500 !text-white cursor-pointer"
                        onClick={() => handleEditOpen(item)}
                      >
                        <Edit className="w-3 h-3 inline-block mr-1" /> Edit
                      </Tag>
                    </div>
                    <Select
                      size="small"
                      placeholder="Update Status"
                      onChange={(status) => updateStatus(item.id, status)}
                    >
                      <Select.Option value="pending">Pending</Select.Option>
                      <Select.Option value="inProgress">
                        inProgress
                      </Select.Option>
                      <Select.Option value="completed">Completed</Select.Option>
                    </Select>
                  </div>
                  <label className="text-slate-600 text-sm flex mt-3">
                    {moment(item.createAt).format("DD MMM YYYY hh:mm A")}
                  </label>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Footer */}
      <footer className="bg-gradient-to-r from-sky-900 via-slate-800 to-rose-500 bg-white h-auto min-h-[60px] fixed bottom-0 left-0 w-full flex flex-col sm:flex-row justify-between items-center px-2 sm:px-8 py-2 gap-2 sm:gap-0 z-50">
        <div className="w-full sm:w-auto text-center">
          <h1 className="text-sm xs:text-base sm:text-xl font-bold whitespace-pre-line break-words">
            <span className="text-gray-200">Total: {tasks.length}</span> |{" "}
            <span className="text-yellow-400">Pending: {pendingCount}</span> |{" "}
            <span className="text-blue-400">InProgress: {inProgressCount}</span>{" "}
            |{" "}
            <span className="text-green-400">Completed: {completedCount}</span>
          </h1>
        </div>

        <a
          href="https://sonu.com"
          className="text-white hover:underline w-full sm:w-auto text-center text-sm xs:text-base"
        >
          www.sonu.com
        </a>
      </footer>

      {/* Create Task Modal */}
      <Modal
        open={open}
        footer={null}
        onCancel={handleClose}
        maskClosable={false}
      >
        <h1 className="text-lg font-mediu mb-4">New task</h1>
        <Form onFinish={createTask} form={form}>
          <Form.Item name="title" rules={[{ required: true }]}>
            <Input placeholder="Task Name" size="large" />
          </Form.Item>
          <Form.Item name="description" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Task Description goes here" rows={5} />
          </Form.Item>
          <Form.Item name="priority" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select Priority">
              <Select.Option value="highest">Highest</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="lowest">Lowest</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" size="large">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        open={editOpen}
        footer={null}
        onCancel={() => setEditOpen(false)}
        maskClosable={false}
      >
        <h1 className="text-lg font-mediu mb-4">Edit task</h1>
        <Form onFinish={handleEditSubmit} form={form}>
          <Form.Item name="title" rules={[{ required: true }]}>
            <Input placeholder="Task Name" size="large" />
          </Form.Item>
          <Form.Item name="description" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Task Description goes here" rows={5} />
          </Form.Item>
          <Form.Item name="priority" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select Priority">
              <Select.Option value="highest">Highest</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="lowest">Lowest</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" size="large">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;
