import { login, logout, getInfo,register,update } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: '',
    name: '',
    avatar: '',
    introduce:'',
    age:'',
    id:'',
    email:''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_AGE:(state,age)=>{
    state.age=age
  },
  SET_INTRODUCE:(state,introduce)=>{
    state.introduce=introduce
  },
  SET_ID:(state,id)=>{
    state.id=id;
  },
  SET_EMAIL:(state,email)=>{
    state.email=email;
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: username, password: password }).then(response => {
        console.log(response)
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        
        reject(error)
      })
    })
  },
  //user register
  register({ commit },userInfo){
    const { email,username, password } = userInfo
    return new Promise((resolve,reject)=>{
      console.log("进入action")
      register({email:email,password:password,name:username}).then(response=>{
        console.log(response)
        //const{data}=response
        //commit('SET_TOKEN', data)
        //setToken(data)
        resolve()
      }).catch(error=>{
        reject(error)
      })
    })
  },
  updateInfo({commit},userInfo){
    console.log(userInfo)
    const{name,age,introduce,avatarFile}=userInfo
    let formData=new FormData()
    formData.append('name',name)
    formData.append('age',age)
    formData.append('introduce',introduce)
    if(avatarFile!=''){
      formData.append('avatarFile',avatarFile.raw)
    }
    console.log(formData)
    console.log("进入UpdateAction")
    return new Promise((resolve,reject)=>{
      
      update(formData).then(response=>{
        const{data}=response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, age,introduce,avatar,id } = data
        commit('SET_NAME', name)
        commit('SET_AGE', age)
        commit('SET_INTRODUCE',introduce)
        commit('SET_AVATAR',avatar)


        resolve()
      }).catch(error=>{
        console.log("")
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log("获取信息")
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar,age,introduce,id,email } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_AGE', age)
        commit('SET_INTRODUCE',introduce)
        commit('SET_EMAIL',email)
        commit('SET_ID',id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

