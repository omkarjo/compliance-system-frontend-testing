import { useAppSelector } from "@/store/hooks";

export const useGetCurrentUser = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  return { isAuthenticated, user };
};
