import React, { createContext, useReducer, useContext } from 'react';
import { v1 as uuid } from 'uuid';
import { DragItem } from './DragItem';
import { findItemIndexById } from './utils/findItemIndexById';
import { moveItem } from './utils/moveItem';

const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps);

type Action =
  | {
    type: 'ADD_LIST';
    payload: string;
  }
  | {
    type: 'ADD_TASK';
    payload: { text: string; taskId: string };
  }
  | {
    type: "MOVE_LIST"
    payload: {
      dragIndex: number
      hoverIndex: number
    }
  }
  | {
    type: "SET_DRAGGED_ITEM"
    payload: DragItem | undefined
  }

interface Task {
  id: string;
  text: string;
}

interface List {
  id: string;
  text: string;
  tasks: Task[];
}

interface AppStateContextProps {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

export interface AppState {
  lists: List[];
  draggedItem?: any;
}

export const useAppState = () => {
  return useContext(AppStateContext)
}

const appData: AppState = {
  lists: [
    {
      id: "0",
      text: "To Do",
      tasks: [{ id: "c0", text: "Generate app scaffold" }]
    },
    {
      id: "1",
      text: "In Progress",
      tasks: [{ id: "c2", text: "Learn Typescript" }]
    },
    {
      id: "2",
      text: "Done",
      tasks: [{ id: "c3", text: "Begin to use static typing" }]
    }
  ]
}

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "ADD_LIST": {
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: uuid(), text: action.payload, tasks: [] }
        ]
      }
    }
    case "ADD_TASK": {
      const targetLaneIndex = findItemIndexById(
        state.lists,
        action.payload.taskId
      )
      state.lists[targetLaneIndex].tasks.push({
        id: uuid(),
        text: action.payload.text
      })
      return {
        ...state
      }
    }
    case "MOVE_LIST": {
      const { dragIndex, hoverIndex } = action.payload;
      state.lists = moveItem(state.lists, dragIndex, hoverIndex);
      return { ...state }
    }
    case "SET_DRAGGED_ITEM": {
      return { ...state, draggedItem: action.payload }
    }
    default: {
      return state
    }
  }
}

export const AppStateProvider = ({ children }: React.PropsWithChildren<any>) => {
  const [state, dispatch] = useReducer(appStateReducer, appData)

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  )
}
