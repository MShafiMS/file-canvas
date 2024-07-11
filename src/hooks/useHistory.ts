import { ElementData } from '@types';
import { SetStateAction, useState } from 'react';

export const useHistory = (initialElements: ElementData[]) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<ElementData[][]>([initialElements]);

  const setState = (action: SetStateAction<ElementData[]>, overwrite = false) => {
    const newState: ElementData[] =
      typeof action === 'function' ? (action as (prevState: ElementData[]) => ElementData[])(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => {
    if (index > 0) {
      setIndex((prevState) => prevState - 1);
    }
  };

  const redo = () => {
    if (index < history.length - 1) {
      setIndex((prevState) => prevState + 1);
    }
  };

  const reset = () => {
    setHistory([initialElements]);
    setIndex(0);
  };

  const removeById = (id: number) => {
    const elements = history[index];
    const newHistory = elements.filter((elm) => elm.id !== id).map((elm, id) => ({ ...elm, id }));
    setHistory((prev) => [...prev, newHistory]);
    setIndex((prevState) => prevState + 1);
  };

  return { elements: history[index], setElements: setState, undo, redo, reset, removeById };
};
