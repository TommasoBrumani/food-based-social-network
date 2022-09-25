<template>
  <img class="profile-picture" :src="userProfilePicture" :alt="userName">
</template>

<script>
import {mapState} from 'vuex'

export default {
  data(){
    return {
    }
  },
  computed: {
    ...mapState(['users']),

    user() {
      const allUsers = this.users;
      //console.log("UserPP " + this.userId);
      let thisUser = allUsers.find((user) => user.id == this.userId);

      if(thisUser)
        return thisUser;
      else
        return {}
    },
    userProfilePicture(){
      return this.user.profilePicture !== undefined && this.user.profilePicture !== "" ? this.user.profilePicture : "/images/profile_placeholder.png"
    },
    userName(){
      const name = this.user.name !== undefined && this.user.name !== "" ? this.user.name : "User"
      return name + "'s profile picture"
    }
  },
  props:{
    // uid of the user
    userId:{ type: String, default: ''},
  },

  methods: {
  },
}
</script>
<style scoped>
template{
display:flex;
}
.profile-picture{
  display:block;
  margin:1em;
  margin-left:auto;
  margin-right:auto;
  border-radius: 50%;
  width: 60px;
  height: 60px;
}
</style>
