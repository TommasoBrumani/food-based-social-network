<template>
  <div class="p-container">
    <a @click="$emit('closePostModal')" class="close">Close</a>

    <div :class="classForPosts">
      <h5 class="post_title">{{ fullPost.title | capitalize }}</h5>
      <span>Created by: {{ fullPost.userName }} {{ fullPost.lastName }}</span>
      <span>{{ fullPost.createdOn | formatDateFromNow }}</span>
      <p v-if="fullPost.currParticipant < fullPost.numParticipant">
        Number of participants: {{ fullPost.currParticipant }} /
        {{ fullPost.numParticipant }}
      </p>
      <p class="post_nbParticipants" v-else>This meal is at full capacity!</p>
      <p>Location: {{ fullPost.cityName | capitalize }}</p>
      <p class="post_date">Time of meeting: {{ fullPost.time | formatDateTime }}</p>
      <br />
      <p>Recipe:</p>
      <p>{{ fullPost.recipe }}</p>
      <br />
      <p>Meal description:</p>
      <p>{{ fullPost.description }}</p>
      <br />

      <!-- BUTTONS -->

      
      <router-link 
          v-if="fullPostMembers.findIndex((member) => member.userId === userId) != -1" 
          :to="{ name: 'postBoard', params: { postId: fullPost.id } }" custom v-slot="{ navigate }">
              <button @click="navigate" class="button" role="link">View post board</button>
            </router-link>

      <br />
      <br />

      <button v-if="fullPost.time.toDate() <= new Date()" disabled="true">
        Meal date has passed
      </button>

      <button
        v-else-if="userId == fullPost.userId"
        @click="deletePost(fullPost)"
        class="button"
      >
        Delete this post
      </button>

      <button
        v-else-if="
          fullPostMembers.findIndex((member) => {
            return member.userId == userId;
          }) != -1
        "
        @click="removeFromPost(fullPost, userId)"
        class="button"
      >
        Leave Post
      </button>

      <button
        v-else-if="fullPost.currParticipant < fullPost.numParticipant"
        @click="joinPost(fullPost)"
        class="button"
      >
        Join Post
      </button>

      <button v-else disabled="true">Meal full</button>
    </div>

    <!-- Meal member's -->
    <div v-show="fullPostMembers.length" class="members">
      <p>This meal's current participants:</p>
      <div v-for="member in fullPostMembers" :key="member.id" class="member">
        <router-link
          :to="{ name: 'userProfile', params: { userId: member.userId } }"
        >
          {{ member.userName }} {{ member.lastName }}
        </router-link>

        <button
          v-if="userId == fullPost.userId && member.userId != userId"
          @click="removeFromPost(fullPost, member.userId)"
        >
          Remove
        </button>
      </div>
    </div>
    

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {};
  },

  props: {
    fullPost: {},
  },

  action: {},

  computed: {
    ...mapState(["userId", "postMembers"]),

    fullPostMembers() {
      let members = this.postMembers.filter(
        (membership) => membership.postId == this.fullPost.id
      );

      return members;
    },
    /*
     class of the post div
      return `post` if the post is still open (i.e. you can join it) (default)
      returns `post passed` if the post is closed (i.e. date is passed)
      returns `post full` if the post is full (i.e. number of participant is max)
       returns `post passed full` if both
    */
    classForPosts(){
      const postTime = this.fullPost.time.toDate().getTime(); // Date & Time of the meating
      let cssClassArray = ["post"]

      if(postTime < Date.now()) // Meal has happened
        cssClassArray.push(" passed")
      if(this.fullPost.currParticipant >= this.fullPost.numParticipant) // Meal is full
        cssClassArray.push(" full")

      let cssClass = ""

      cssClassArray.forEach((value) => {cssClass =cssClass.concat(value)}) // Creating the css class

      return cssClass
    }
  },

  methods: {
    ...mapActions(["deleteMealPost", "joinMealPost", "leaveMealPost"]),

    deletePost(fullPost) {
      this.deleteMealPost({
        postId: fullPost.id,
      });

      this.$emit("closePostModal");
    },

    joinPost(fullPost) {
      this.joinMealPost({
        postId: fullPost.id,
        currParticipant: fullPost.currParticipant,
      });
    },

    removeFromPost(fullPost, memberId) {
      this.leaveMealPost({
        postId: fullPost.id,
        currParticipant: fullPost.currParticipant,
        memberId: memberId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

  // CSS to distinguished post that are full, and/or passed
  .passed{
    box-shadow: 0.5px 0.5px 4px coral;
    .post_title::after{
      content: " PASSED";
      color: lightcoral;
    }
    
    .post_date{
      color: lightcoral;
    }
  }

  .full{
    box-shadow: 0.5px 0.5px 4px coral;
    .post_nbParticipants{
      color: lightcoral;
    }
    .post_title::after{
      content: " FULL";
      color: lightcoral;
    }
  }

  .passed.full{
    .post_title::after{
      content: " PASSED, FULL";
      color: lightcoral;
    }
  }
</style>