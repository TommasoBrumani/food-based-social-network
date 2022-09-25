<template>
  <header>
    <section>
      <div class="col1">
        <router-link to="/">
          <h3>Eat&Meet</h3>
        </router-link>
        <ul class="inline">
          <li>
            <router-link to="/">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/settings">Settings</router-link>
          </li>
          <li><a @click="logout()">Logout</a></li>
          <li>
            <router-link :to="{ name: 'userProfile', params: { userId: userId } }">
              <UserProfilePicture :userId="userId"/> <span>{{ userFirstName}} </span> <span>{{ userLastName}} </span>
            </router-link>
          </li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import UserProfilePicture from "@/components/UserProfilePicture"


export default {
  computed: {
    ...mapState(['userId','userProfile']),
    userFirstName(){
      return this.userProfile.name !== undefined && this.userProfile.name !== "" ? this.userProfile.name : "UserLastName"
    },
    userLastName(){
      return this.userProfile.lastName !== undefined && this.userProfile.lastName !== "" ? this.userProfile.lastName : "UserLastName"
    }
  },

  methods: {
      ...mapActions(['logout'])
  },
  components:{
    UserProfilePicture
  },
}
</script>
