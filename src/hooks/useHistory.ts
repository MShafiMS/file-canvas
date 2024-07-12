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

  const removeById = (id: string) => {
    const elements = history[index];
    const newHistory = elements.filter((elm) => elm.id !== id);
    setHistory((prev) => [...prev, newHistory]);
    setIndex((prevState) => prevState + 1);
  };

  const changeDirection = (id: string, direction: 'forward' | 'backward') => {
    const elements = history[index];
    const elementIndex = elements.findIndex((element) => element.id === id);
    console.log({ elementIndex, direction });
    if (elementIndex === -1) {
      return;
    }

    if (direction === 'forward' && elementIndex < elements.length - 1) {
      // Move element forward
      [elements[elementIndex], elements[elementIndex + 1]] = [elements[elementIndex + 1], elements[elementIndex]];
    } else if (direction === 'backward' && elementIndex > 0) {
      // Move element backward
      [elements[elementIndex], elements[elementIndex - 1]] = [elements[elementIndex - 1], elements[elementIndex]];
    }
    setHistory((prev) => [...prev, elements]);
    setIndex((prevState) => prevState + 1);
  };

  return { elements: history[index], setElements: setState, undo, redo, reset, removeById, changeDirection };
};
