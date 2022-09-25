import Vue from 'vue'
import * as fb from '../firebase'
import router from '../router/index'

// Vuex Imports
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
Vue.use(Vuex)

// directory where profile pictures are stored
const profilePictureDirectory = "ProfilePictures"
const profilePictureName = "profile_picture"
const ppPlaceHolderPath = "/images/profile_placeholder.png"

const store = new Vuex.Store({

  state: {
    //stores the current user
    userProfile: {
      /*
      createdOn: new Date(),
      name: form.name,
      lastName: form.lastname,
      birthday: form.birthday,
      city: form.city,
      profilePicture: ''
      */ 
    },
    userId: { type: String },
    //stores the available posts
    posts: [],
    postMembers: [],
    comments: [],
    users: [],
    ratings: [],
  },

  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val
    },

    setUserId(state, val) {
      state.userId = val
    },

    setPosts(state, val) {
      state.posts = val
    },

    setUsers(state, val) {
      state.users = val
    },

    setPostMembers(state, val) {
      state.postMembers = val
    },

    setComments(state, val) {
      state.comments = val
    },

    setRatings(state, val) {
      state.ratings = val
    },

    ...vuexfireMutations
  },

  getters: {
  },

  actions: {

    async login({ dispatch }, form) {
      //signs in the user

      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
        .catch((err) => {throw (err)})

      return dispatch('fetchUserProfile', user)
    },

    async fetchUserProfile({ commit }, user) {
      //gets the user
      const userProfile = await fb.usersCollection.doc(user.uid).get()
      .catch((err) => {console.log(err.name +" " + err.message); return})
      //sets the current user to the fetched user
      commit('setUserProfile', userProfile.data())
      commit('setUserId', user.uid)
      //changes the route to dashboard if the user just logged in
      if (router.currentRoute.path === '/login') {
        return router.push('/')
      }
    },

    async signup({ dispatch }, form) {
      //signs up the user
      
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
        .catch((err) => {throw (err)})
        
      //creates a user profile in the user collection
      await fb.usersCollection.doc(user.uid).set({
        createdOn: new Date(),
        name: form.name,
        lastName: form.lastname,
        birthday: form.birthday,
        city: form.city,
        profilePicture: ''
      })

      return dispatch('fetchUserProfile', user)
    },

    async logout({ commit }) {
      //signs out the user
      await fb.auth.signOut()
      //clears the current user and changes route to login
      commit('setUserProfile', {})
      return    router.push('/login')
    },

    async createMealPost({ state, dispatch }, post) {
      const res = await fb.postsCollection.add({
        title: post.title,
        numParticipant: post.numParticipant,
        recipe: post.recipe,
        time: post.time,
        cityName: post.cityName,
        description: post.description,
        ingredients: post.ingredients,
        createdOn: new Date(),
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        lastName: state.userProfile.lastName,
        currParticipant: 0
      })

      return dispatch('joinMealPost', {
        postId: res.id,
        currParticipant: 0
      })
    },

    async deleteMealPost({ state }, post) {
      await fb.postsCollection.doc(post.postId).delete()

      const membersDocs = await fb.postMembersCollection.where('postId', '==', post.postId).get()
      membersDocs.forEach(doc => {
        fb.postMembersCollection.doc(doc.id).delete()
      })
    },

    async joinMealPost({ state }, post) {
      const userId = fb.auth.currentUser.uid
      const docId = `${post.postId}_${userId}`

      const doc = await fb.postMembersCollection.doc(docId).get()
      if (doc.exists) { return }

      //creates membership for the user for this post
      await fb.postMembersCollection.doc(docId).set({
        postId: post.postId,
        userId: userId,
        userName: state.userProfile.name,
        lastName: state.userProfile.lastName
      })

      //updates the current participants count for the post
      return fb.postsCollection.doc(post.postId).update({
        currParticipant: post.currParticipant + 1
      })
    },

    async leaveMealPost({dispatch}, post) {
      const userId = post.memberId
      const docId = `${post.postId}_${userId}`

      const doc = await fb.postMembersCollection.doc(docId).get()
      if (!doc.exists) { return }

      //deletes membership for the user for this post
      await fb.postMembersCollection.doc(docId).delete()

      //updates the current participants count for the post
      return fb.postsCollection.doc(post.postId).update({
        currParticipant: post.currParticipant - 1
      })
      // we updates the ingredients 
      .then(()=>{dispatch('updateIngredientsAfterUserLeave',{postId:post.postId})}) 
    },

    
    async addComment({ state }, data) {
      const userId = fb.auth.currentUser.uid

      return fb.commentsCollection.add({
        postId: data.postId,
        userId: userId,
        userName: state.userProfile.name,
        lastName: state.userProfile.lastName,
        content: data.content,
        createdOn: new Date()
      })
    },
    
    async rateUser({ state }, data) {
      const userId = fb.auth.currentUser.uid
      const docId = `${data.postId}_${userId}_${data.memberId}`

      //Checks if the user has already rated the member for this post, if so returns
      let doc = await fb.ratingsCollection.doc(docId).get()
      
      if(doc.exists) { return }

      return fb.ratingsCollection.doc(docId).set({
        postId: data.postId,
        userId: userId,
        memberId: data.memberId,
        rating: data.rating
      })
    },

    // updates the profile of the curent user
    // Nb: don't use this to change user profile picture directly, 
    // Use uploadProfilePicture
    async updateProfile({ dispatch, state }, user) {
      const userId = fb.auth.currentUser.uid

      //updates the user's data
      const userRef = await fb.usersCollection.doc(userId).update(/*{
        name: user.name,
        lastName: user.lastName,
        birthday: user.birthday,
        city: user.city,
        profilePicture: user.profilePicture
      }*/user)

      //reloads local current user data
      await dispatch('fetchUserProfile', { uid: userId })

      
      let name = state.userProfile.name
      let lname = state.userProfile.lastName
      if(user.name != undefined && user.name !== '')
        name = user.name
      if(user.lastName != undefined && user.name !== '')
        lname = user.lastName

      if(!( // if the user name and last name hasn't been modified, return
          (user.name != undefined && user.name !== '') || // name modified
          (user.lastName != undefined && user.name !== '') // lastName modified
          ))
        return 
      
      // updates name and lastname
      //updates all of the user's posts
      const postDocs = await fb.postsCollection.where('userId', '==', userId).get()
      postDocs.forEach(doc => {
        fb.postsCollection.doc(doc.id).update({
          userName: name,
          lastName: lname
        })
      })

      //updates all of the user's memberships
      const membersDocs = await fb.postMembersCollection.where('userId', '==', userId).get()
      membersDocs.forEach(doc => {
        fb.postMembersCollection.doc(doc.id).update({
          userName: name,
          lastName: lname
        })
      })
      
    },
    /* 
      Upload user profile picture on firebase storage then updates the user profile pic
      Profile pictures are stored in ${profilePictureDirectory}/<user_id>/${profilePictureName}.<file:extention>
      file : image

      throws Error
    */
    async uploadProfilePicture(context, file){ 
      if(!file)
        throw new Error("File null")
      if(!file.type.match('image.*'))
        throw new TypeError("File isn't a valid image")

      const userId = fb.auth.currentUser.uid
      // building file extention
      const extention = file.type.substring(file.type.lastIndexOf('/') + 1)
      // building filePath
      const filePath = profilePictureDirectory +'/' + userId +'/' + profilePictureName + '.' + extention;

      return fb.storage.ref(filePath).put(file);
    },
    /*
    async downloadProfilePicture(context, uid){
      return;
    },*/

    // TAKING CARE OF INGREDIENT
    /**
     * Updates the ingredients list 
     * @param {*} context 
     * @param {*} meal : object containing postId, userId, ingredient
     * @param {boolean} meal.cancel : if true cancel taking care of the Ingredient
     * @returns 
     */
    async takeCareOfIngredient(context, meal){
      if(!meal) 
        throw new TypeError("meal is invalid")
      if(meal.postId == undefined || meal.postId == '')
        throw new TypeError("meal.postId is invalid")
      if(!meal.ing)
        throw new TypeError("meal.ing is invalid")
      
      let post ={} // post
      let arrayIng = []
      
      const docPost = await fb.postsCollection.doc(meal.postId)
      await docPost.get().then((doc)=>{
        if(doc.exists){ // if this post exists
          post = doc.data() // array of ingredients
        }else{
          throw new Error("Invalid postId")
        }
      }).catch((err)=>{
        console.log(err.name + " " + err.message);
      })
      // Getting the list of ingredients
      arrayIng = post.ingredients

      // Updates the ingredients list :
      // find the ingredient
      let i = arrayIng.findIndex((el) => el.name === meal.ing.name && 
                                        el.quantity === meal.ing.quantity && 
                                        el.unit === meal.ing.unit)

      if(i === -1) // ingredient wasn't found
        throw new Error("Ingredient wasn't found in firebase")
      
      // Updates who brings the ingredient
      if(meal.cancel === true){// if the user want's to cancel his ingredient
        if(context.state.userId !== arrayIng[i].bringerId){
          throw new Error("Can't cancel ingrdient that the user don't bring")
        }
        arrayIng[i].bringerId = ""
      }
      else{ // user take's care of this ingredient
        // check if ingredient is already took care of
        if(arrayIng[i].bringerId !== undefined && arrayIng[i].bringerId !== ""){
          throw new Error("takeCareOfIngredient :Ingredient is already taken care of")
        }
        arrayIng[i].bringerId = context.state.userId
      }

      // updates it on firebase
      return docPost.update({ingredients: arrayIng})
    },
    /**
     * 
     * @param {*} context 
     * @param {*} user 
     */
    async updateIngredientsAfterUserLeave(context,meal){
      if(!meal) 
        throw new TypeError("meal is invalid")
      if(meal.postId == undefined || meal.postId == '')
        throw new TypeError("meal.postId is invalid")
      
      let post ={} // post
      let arrayIng = []
      
      const docPost = await fb.postsCollection.doc(meal.postId)
      await docPost.get().then((doc)=>{
        if(doc.exists){ // if this post exists
          post = doc.data() // array of ingredients
        }else{
          throw new Error("Invalid postId")
        }
      }).catch((err)=>{
        console.log(err.name + " " + err.message);
      })
      // Getting the list of ingredients
      arrayIng = post.ingredients

      for(let i =0; i< arrayIng.length;i++){ // updating list of ingredient
        if(arrayIng[i].bringerId !== undefined && arrayIng[i].bringerId === context.state.userId)
          arrayIng[i].bringerId = ""
      }

      return docPost.update({ingredients:arrayIng})
    },

    // --------------------- VUEX FIRE  ---------------------------
    // Binds all the posts ORDER BY createdOn desc
    bindPosts: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('posts', fb.postsCollection.orderBy('time', 'asc'));
    }),

    // Binds all users
    bindUsers: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('users', fb.usersCollection);
    }),

    // Binds all postMembers
    bindPostMembers: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('postMembers', fb.postMembersCollection);
    }),

    // Binds all comments ORDER BY desc
    bindComments: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('comments', fb.commentsCollection.orderBy('createdOn', 'asc'));
    }),

    // Binds all ratings
    bindRatings: firestoreAction(({ bindFirestoreRef }) => {
      return bindFirestoreRef('ratings', fb.ratingsCollection);
    }),

    // Binds userProfile
    bindUserProfile: firestoreAction(({bindFirestoreRef})=>{
      return bindFirestoreRef('userProfile', fb.usersCollection.where('id','==', this.userId))
    })
  },

  modules: {
  }

})

store.dispatch('bindPosts')

store.dispatch('bindPostMembers')

store.dispatch('bindComments')

store.dispatch('bindUsers')

store.dispatch('bindRatings')

export default store