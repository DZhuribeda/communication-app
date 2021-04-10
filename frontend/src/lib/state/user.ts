import create from "zustand"
import { combine, persist } from "zustand/middleware";

export const useUser = create(persist(
    combine({
        username: null as string | null,
    },
    set => ({
        changeUsername: (username: string | null): void => set({ username })
    })),
    {
        name: "user-storage", // unique name
    }
));


export const useLoggedUser = (): { username: string } | null => {
    const username = useUser((state) => state.username);
    if (!username) return null;
    return {
        username
    };
}

