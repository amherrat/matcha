import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        status: '',
        data: {}
    },
    plugins: [createPersistedState()],
    mutations: {
        // LOGIN(state, user){
        //     state.data = user;
        // },
        request(state){
            state.status = 'loading'
        },
        success(state, data){
            state.status = 'success'
            state.data = data
        },
        error(state){
            state.status = 'error'
        },
        logout(state){
            state.status = ''
            state.data = {}
        },
        update(state, data){
            state.status = 'success'
            state.data = data;
        }
    },
    actions: {
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('request')
                axios.get('http://localhost:3000/userdata/'+user.user, {
                    params: {
                        token: user.token
                      }
                }).then(
                    res => {
                        if(res.data.success){
                            const data = res.data.data;
                            commit('success', data)
                            console.log('new data:');
                            console.log(data);
                            resolve(res.data)
                        }else{
                            commit('error')
                            localStorage.removeItem('token')
                            reject("API ERROR:",res.data)
                        }
                    }
                ).catch( err => {
                    commit('error')
                    localStorage.removeItem('token')
                    reject(err)
                    }
                )
            })
            //commit('LOGIN', user)
        },
        logout({ commit }){
            return new Promise((resolve) => {
                commit('logout')
                localStorage.removeItem('token')
                delete axios.defaults.headers.common["x-access-token"]
                resolve()
            })
        },
        update({commit},user){
            return new Promise((resolve) => {
                commit('update',user)
                resolve()
            })
        }
    },
    getters: {
        getUser: state => {
            return state.data.user;
        },
        getImages: state => {
            return state.data.images;
        },
        getTags: state => {
            return state.data.tags;
        },
        getLikes: state => {
            return state.data.likes;
        }
    }
  })
  
  // this.$store.getters.getUser;