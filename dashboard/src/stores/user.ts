import {defineStore} from "pinia";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()

export interface User {
    id: number;
    email: string;
    role: string;
    password: string;
    confirmation_password: string;
}

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        user: null as User | null,
        token: "" as string,
    }),

    getters: {
        isLoggedIn: (state) => state.token !== "",
        isAdmin: (state) => state.user?.role === 'ROLE_ADMIN',
    },

    actions: {
        async setUser(user: User) {
            this.user = user;
        },

        async setToken(token: string) {
            this.token = token;
            localStorage.setItem('token', token);
        },

        async fetchUser() {
            try {
                const response = await axios.get('http://localhost:3000/auth/user');

                if (response.status === 200) {
                    this.user = response.data;
                }
            } catch (e) {
                console.error(e);
            }
        },
    }
});
