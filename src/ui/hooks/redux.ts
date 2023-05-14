
/*
 * Module dependencies.
 */

import { AppDispatch, RootState } from 'src/state/store';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

/*
 * Exporting typed hooks.
 */

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
