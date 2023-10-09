import {defineStore} from "pinia";
import axios from "axios";

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
                const response = await axios.post('http://localhost:3000/auth/login', form);
                if (response.status === 200) {
                    this.user = response.data;
                    localStorage.setItem('token', response.data.token);
                }
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
