<template>
  <div>
    <div :class="classForPosts">

      <h5 class="post_title">{{ post.title | capitalize }}</h5>
      <span>Created by: {{ post.userName }} {{ post.lastName }}</span>
      <span class="time">{{ post.createdOn | formatDateFromNow }}</span>
      <p v-if="post.currParticipant < post.numParticipant">
        Number of participants: {{ post.currParticipant }} /
        {{ post.numParticipant }}
      </p>
      <p class="post_nbParticipants" v-else>This meal is at full capacity!</p>
      <p>Location: {{ post.cityName | capitalize }}</p>
      <p class="post_date">Date: {{ post.time | formatDateTime }}</p>
      <p>Recipe:</p>
      <p>{{ post.recipe | trimLength }}</p>
      <p>Meal description:</p>
      <p>{{ post.description | trimLength }}</p>

      <a @click="showPostModal = true">View full post</a>
    </div>

    <transition name="fade">
      <div v-if="showPostModal" class="p-modal">

        <FullPostDisplay :fullPost="post" @closePostModal="showPostModal = false"></FullPostDisplay>

      </div>
    </transition>
  </div>
</template>

<script>
import FullPostDisplay from "@/components/FullPostDisplay.vue";

export default {
  data() {
    return {
      showPostModal: false
    };
  },

  props: {
    post: {},
  },

  action: {},

  computed: {
    /*
     class of the post div
      return `post` if the post is still open (i.e. you can join it) (default)
      returns `post passed` if the post is closed (i.e. date is passed)
      returns `post full` if the post is full (i.e. number of participant is max)
       returns `post passed full` if both
    */
    classForPosts(){
      const postTime = this.post.time.toDate().getTime(); // Date & Time of the meating
      let cssClassArray = ["post"]

      if(postTime < Date.now()) // Meal has happened
        cssClassArray.push(" passed")
      if(this.post.currParticipant >= this.post.numParticipant) // Meal is full
        cssClassArray.push(" full")

      let cssClass = ""

      cssClassArray.forEach((value) => {cssClass =cssClass.concat(value)}) // Creating the css class

      return cssClass
    }
  },

  components: {
    FullPostDisplay,
  },

  methods: {},

  filters: {
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
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
