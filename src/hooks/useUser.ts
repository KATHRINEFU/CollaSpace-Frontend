import {  useAppSelector } from '../redux/hooks';
import { getUser } from '../utils/localStorage';

export const useUser = () => {
    return useAppSelector(state => state.auth.user) ?? getUser()
};