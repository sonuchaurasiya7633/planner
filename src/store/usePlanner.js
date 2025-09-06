import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePlanner = create(persist(
(set)=>({
   tasks: [],
   addTask: (payload)=>set((state)=>({
    tasks:[...state.tasks,
      payload
    ]
   })),
   deleteTask: (id)=>set((state)=>({
    tasks: state.tasks.filter((task)=>task.id !== id)
   })),
   updateStatus:(id, status)=>set((state)=>({
     tasks: state.tasks.filter((task)=>{
      if(task.id ===id)
        task.status = status;
         return task;
     })
   })),
     updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? updatedTask : task
          ),
        })),
   deleteAllTask:()=>set(()=>({
    tasks:[]
   }))

}),
  {name:"planner"}
)) 
