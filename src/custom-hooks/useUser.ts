import axios from "axios";
import useSWR from "swr";

const fetchUser = (url: string) => axios.get(url).then(res => res.data);

export const useGetUser = () => {
  const {data, isLoading, error} = useSWR("api/auth/user", fetchUser);

  return {user: data, isLoading, isError: error};
};

const fetchUsers = (url: string) => axios.get(url).then(res => res.data);

export const useGetUsers = () => {
  const {data, isLoading, error} = useSWR("api/users", fetchUsers);

  return {users: data, isLoading, isError: error};
}