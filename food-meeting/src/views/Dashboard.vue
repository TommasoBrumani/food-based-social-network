<template>
  <div id="dashboard">
    <section>
      <div class="col1">
        <div class="profile">
          <h5>Hello, {{ userProfile.name }} {{ userProfile.lastName }}</h5>

          <div class="create-post">
            <router-link to="/createPost" custom v-slot="{ navigate }">
              <button @click="navigate" class="button" role="link">Create Post</button>
            </router-link>

            <button
              @click="showActivePosts"
              class="button"
              :disabled="show == 'activePosts' ? true : false"
            >
              Show active posts
            </button>

            <button
              @click="showUserPosts"
              class="button"
              :disabled="show == 'userPosts' ? true : false"
            >
              Show your active posts
            </button>

            <button
              @click="showMemberPosts"
              class="button"
              :disabled="show == 'memberPosts' ? true : false"
            >
              Show active posts you are participating in
            </button>

            <button
              @click="showAllPosts"
              class="button"
              :disabled="show == 'allPosts' ? true : false"
            >
              Show all posts
            </button>
          </div>
        </div>
      </div>

      <div class="col2">
        <h1>{{ displayTitle }}</h1>
        <div id="search_div">
          <label for="search_bar">Search posts from a city </label>
          <input
            id="search_bar"
            type="search"
            placeholder="E.g. Paris"
            v-on:keydown.enter="search"
          />
          <button id="search_button" class="button"  @click="search">Search</button>
        </div>
        <div class="results" v-if="displayedPosts.length">
          <PostDisplay
            v-for="post in displayedPosts"
            :post="post"
            :key="post.id"
            class="allPosts"
          >
          </PostDisplay>
        </div>

        <div v-else>
          <p class="no-results">{{ noResultsMessage }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PostDisplay from "@/components/PostDisplay";

export default {
  title: 'Eat & Meet - Dashboard',

  data() {
    return {
      show: "activePosts",
      noResultsMessage: "There are currently no posts.",
      location: "",
    };
  },

  computed: {
    ...mapState(["userProfile", "userId", "posts", "postMembers"]),

    displayedPosts() {
      const allPosts = this.posts;

      let filteredPosts = allPosts;

      //maybe put filter here
      if (this.location !== null && this.location !== "") {
        let l = this.location.toLowerCase();
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.cityName !== undefined &&
            post.cityName.toLowerCase().includes(l)
        ); // City Name
      }

      if (this.show != "allPosts")
        // If not showing allPost, show only the active one
        filteredPosts = filteredPosts.filter(
          (post) => post.time.toDate() > Date.now()
        );

      if (this.show == "userPosts")
        filteredPosts = filteredPosts.filter(
          (post) => post.userId == this.userId
        );

      else if (this.show == "memberPosts") {
        let memberPosts = this.postMembers
          .filter((membership) => membership.userId == this.userId)
          .map((membership) => membership.postId);

        filteredPosts = filteredPosts.filter((post) =>
          memberPosts.includes(post.id)
        );
      }

      return filteredPosts;
    },

    displayTitle() {
      // String to be displayed for the differents filters
      let ptitle = "";
      if (this.show == "allPosts") {
        ptitle = "All the posts";
      }
      if (this.show == "userPosts") {
        ptitle = "The posts that you created";
      } else if (this.show == "memberPosts") {
        ptitle = "The meals that you are part of";
      } else if (this.show == "activePosts") {
        ptitle = "The active posts";
      }
      return ptitle;
    },
  },

  components: {
    PostDisplay,
  },

  methods: {

    showActivePosts() {
      this.noResultsMessage = "There are no active posts.";
      this.show = "activePosts";
    },

    showUserPosts() {
      this.noResultsMessage = "You are the creator of no active posts.";
      this.show = "userPosts";
    },

    showMemberPosts() {
      this.noResultsMessage = "You are a member of no active posts.";
      this.show = "memberPosts";
    },

    showAllPosts() {
      this.noResultsMessage = "There are currently no posts."
      this.show = "allPosts"
    },
    // EVENTS
    search(){ // 'click' event handler for #search_button and 'keydown.enter' for #search_bar
      let sb = document.getElementById("search_bar")
      this.location = (sb)? sb.value : ""; // if fb is valid (ie non-null, this location = value)
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
