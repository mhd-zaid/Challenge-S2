import {defineStore} from "pinia";
import axios from "axios";
import router from "@/router";

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
    }),

    getters: {
        isLoggedIn: (state) => !!localStorage.getItem('token'),
        isAdmin: (state) => state.user?.role === 'ROLE_ADMIN',
    },

    actions: {
        async login(form: { email: string; password: string }) {
            try {
                await axios.post('http://localhost:3000/auth/login', form).then((res) => {
                    this.user = res.data;
                    localStorage.setItem('token', res.data.token);
                    router.push('/')
                });
            } catch (e) {
                console.error(e);
            }
        },

        async register(form: { email: string; password: string; confirmation_password: string, role: 'ADMIN' }) {
            try {
                const response = await axios.post('http://localhost:3000/auth/register', form);

                if (response.status === 200) {
                    this.user = response.data;
                }
            } catch (e) {
                console.error(e);
            }
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
