import { FaArrowsToDot } from "react-icons/fa6";
import React from "react";
import clsx from "clsx";
import moment from "moment";
import { FaNewspaper } from "react-icons/fa";
import { LuClipboardEdit } from "react-icons/lu";
import { MdAdminPanelSettings, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from "react-icons/md";
import Chart from "../components/Chart";
import Loading from "../components/Loader";
import UserInfo from "../components/UserInfo";
import { useGetDasboardStatsQuery } from "../redux/slice/api/taskApiSlice";
import { BGS, PRIOTITYSTYLES, TASK_TYPE, getInitials } from "../utils";

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className='border-b border-gray-300 '>
      <tr className='text-black text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Team</th>
        <th className='py-2 hidden md:block'>Created At</th>
      </tr>
    </thead>
  );

    const TableRow = ({ task }) => {
    // Add console log to check the task data and task priority
    console.log("Task Data:", task);
    console.log("Task Priority:", task?.priority ? task.priority : "Priority is missing");
  
    // Check if task priority exists
    if (!task?.priority) {
      console.log("Task priority is missing for task:", task);
      return null; // Skip rendering this row if priority is not present
    }
  
    // Ensure title exists before rendering
    const taskTitle = task.title ? task.title : "UNKNOWN TITLE";
  
    return (
      <tr className="border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
        <td className="py-2">
          <div className="flex items-center gap-2">
            <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.stage])} />
            {/* Ensure title exists */}
            <p className="text-base text-black">{taskTitle}</p>
          </div>
        </td>
        <td className="py-2">
          <div className="flex gap-1 items-center">
            <span className={clsx("text-lg", PRIOTITYSTYLES[task.priority])}>{ICONS[task.priority]}</span>
            <span className="capitalize">{task.priority}</span>
          </div>
        </td>
        <td className="py-2">
          <div className="flex">
            {task.team.map((m, index) => (
              <div
                key={index}
                className={clsx("w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1", BGS[index % BGS.length])}>
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </td>
        <td className="py-2 hidden md:block">
          <span className="text-base text-gray-600">
            {moment(task?.date).fromNow()}
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 rounded shadow-md">
      <table className="w-full">
        <TableHeader />
        <tbody>
          {tasks?.map((task, id) => (
            <TableRow key={id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left'>
        <th className='py-2'>Full name</th>
        <th className='py-2'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200  text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700'>
            <span className='text-center'>{getInitials(user?.name)}</span>
          </div>
          <div>
            <p>{user.name}</p>
            <span className='text-xs text-black'>{user?.role}</span>
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className='w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded'>
      <table className='w-full mb-5'>
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index + user?._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const dashboard = () => {
  const { data, isLoading, error } = useGetDasboardStatsQuery();
  
  console.log('Fetched Data:', data); // Log the fetched data for debugging

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Handle the error
  }

  const totals = data?.tasks || {}; // Ensure totals is an object

  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TODOS",
      total: totals["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]",
    },
  ];

  const Card = ({ label, count, bg, icon }) => {
    return (
      <div className='w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
        <div className='h-full flex flex-1 flex-col justify-between'>
          <p className='text-base text-gray-600'>{label}</p>
          <span className='text-2xl font-semibold'>{count}</span>
        </div>
        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white", bg)}>
          {icon}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>
      <div className="w-full bg-white my-16 p-4 rounded shadow-sm">
        <h4 className="text-xl text-gray-600 font-semibold">Chart by priority</h4>
        <Chart data={data?.graphData || []} /> {/* Ensure data is not undefined */}
      </div>
      <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
        <TaskTable tasks={data?.last10Task || []} /> {/* Ensure data is not undefined */}
        <UserTable users={data?.users || []} /> {/* Ensure data is not undefined */}
      </div>
    </div>
  );
};

export default dashboard;
