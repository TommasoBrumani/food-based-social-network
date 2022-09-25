<template>
  <div v-if="user" class ="bigdiv">
    <div class="col1">
    <h1><UserProfilePicture :userId="userId"/>{{ user.name }} {{ user.lastName }}'s profile</h1>

    <p>City: {{ user.city }}.</p>
    <p>Age: {{ user.birthday | formatAge }} years old.</p>
    <p>Ratings:</p>
    <p>
      Good: {{ userRatings.good }} - Mixed: {{ userRatings.mixed }} - Bad:
      {{ userRatings.bad }}
    </p>
    </div>


    <div class="col2">
    <h1>Posts:</h1>
    <div v-if="userPosts.length" id="dashboard">
      <PostDisplay
        v-for="post in userPosts"
        :post="post"
        :key="post.id"
        class="allPosts"
      >
      </PostDisplay>
    </div>

    <div v-else>
      <p class="no-results">This user is the author of no posts.</p>
    </div>
    </div>
  </div>

  <div v-else>Invalid user.</div>
</template>

<script>
import { mapState} from "vuex";
import PostDisplay from "@/components/PostDisplay";
import UserProfilePicture from "@/components/UserProfilePicture"

export default {
  title: 'Eat & Meet - View User Profile',

  data() {
    return {};
  },

  props: {
    userId: { type: String },
  },

  computed: {
    ...mapState(["posts", "postMembers", "users", "ratings"]),

    userPosts() {
      const allPosts = this.posts;

      let memberPosts = this.postMembers
        .filter((membership) => membership.userId == this.userId)
        .map((membership) => membership.postId);

      let filteredPosts = allPosts.filter((post) =>
        memberPosts.includes(post.id)
      );

      return filteredPosts;
    },

    user() {
      const allUsers = this.users;

      let thisUser = allUsers.find((user) => user.id == this.userId);

      return thisUser;
    },

    userRatings() {
      const allRatings = this.ratings;

      let userRatings = allRatings
        .filter((doc) => doc.memberId == this.userId)
        .map((doc) => doc.rating);

      let good = 0;
      let mixed = 0;
      let bad = 0;
      for (let i = 0; i < userRatings.length; i++) {
        if (userRatings[i] === "Good") good++;
        else if (userRatings[i] === "Mixed") mixed++;
        else if (userRatings[i] === "Bad") bad++;
      }

      return {
        good: good,
        mixed: mixed,
        bad: bad,
      };
    },
  },

  components: {
    PostDisplay,
    UserProfilePicture
  },

  methods: {},

  filters: {
    formatAge(val) {
      if (!val) {
        return "?";
      }

      var birthDate = val.toDate();
      var today = new Date();
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    },
  },
};
</script>

<style lang="scss" scoped>

  .bigdiv{
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  align-items:start;
  }

  .col1{
    display:inline-block;
    background: #ffffff;
    padding-left:auto;
    padding-right:auto;
    margin:5px;
    margin-left:2.7em;
    float:left;
    clear:left;
    top:25%;
    position:sticky;
    align-self:flex-start;

    @media screen and (max-width: 742px) {
      position:relative;
      margin: 2em;
      margin-bottom: 1em;
    }
  }

  .col2{
    display:inline-block;
    flex: 0 0 70%;
    margin:20px;

    @media screen and (max-width: 742px){
      margin:auto;
    }
  }
</style>
