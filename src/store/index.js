import { defineStore, createPinia } from 'pinia'
import axios from 'axios'

export const pinia = createPinia();

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        isAuthenticated: false,
        user : null,
        token: null,
    }),
    actions: {
        async login(credentials) {
            try {
                // 서버로 로그인 요청을 보내고 토큰을 받아옵니다.
                const response = await axios.post('/api/auth/login', credentials);
                        
                // 서버에서 반환한 토큰을 상태에 저장합니다.
                this.token = response.data.token.accessToken;

                // 인증된 상태로 표시합니다.
                this.isAuthenticated = true;

                // Axios 설정: 인증된 요청에 토큰 추가
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

                // 사용자 정보도 저장할 수 있습니다.
                this.user = response.data.user;
            } catch(error) {
                console.log('로그인 실패 : ' + error);
                throw error;
            }            
        },
        logout() {
            this.isAuthenticated = false;
            this.user = null;
            this.token = null;
        },
    }
});