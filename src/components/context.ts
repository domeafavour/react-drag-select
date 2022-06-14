import React, { useContext } from 'react';
import { Box } from './typings';

export type ObserveResult<T> = {
  intersecting: boolean;
  data: T;
};

export type SelectionObserver<T> = (selection: Box) => ObserveResult<T>;

export type SelectionUtils<T> = {
  observe: (observer: SelectionObserver<T>) => () => void;
};

export const SelectionContext = React.createContext<SelectionUtils<any>>({
  observe: () => {
    return () => {};
  },
});

export const useSelectionContext = () => {
  return useContext(SelectionContext);
};
