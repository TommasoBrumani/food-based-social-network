<template>
  <div class="dashboard">
    <!-- page is shown only if a post has been passed as a prop and if the user is a member -->
    <div
      v-if="
        post && members.findIndex((member) => member.userId === userId) != -1
      "
    >
      <h1>{{ post.title }}'s board</h1>

      <section>
        <div class="col1">
          <!-- First column displays ingredients and participants -->
          <h1>Ingredients:</h1>
          <ul v-if="post.ingredients.length > 0" class="noDotList">
            <li v-for="ingredient in post.ingredients" :key="ingredient.name">

              <IngredientDisplay :ingredient="ingredient"></IngredientDisplay>
              <!-- if you can take care of bringing this ingredient -->
              <button v-if="canBring(ingredient)" @click.prevent="bringIngredient(ingredient)" type="button" class="button">Bring this ingredient</button>

              <!-- User can cancel bringing ingredient (if he is bringing it)-->
              <div v-else-if="ingredient.bringerId == userId">
                <i>You are bringing this ingredient </i>
                <button @click.prevent="cancelBringingIngredient(ingredient)" type="button" class="button"> Cancel</button>
              </div>

              <!-- Tell to others who is bringing the ingredient (nice)-->
              <i v-else> {{userName(ingredient.bringerId)}} is bringing this ingredient </i>
            </li>
          </ul>
          <div v-else>This post has no ingredients.</div>

          <br />
          <br />

          <h1>Participants:</h1>
          <ul class="inline">
            <li v-for="member in members" :key="member.id" class="user">
              <router-link
                :to="{ name: 'userProfile', params: { userId: member.userId } }"
              >
                <UserProfilePicture :userId="member.userId" class="picture" id="miniature"/>
                {{ member.userName }} {{ member.lastName }}
              </router-link>

              <div v-if="post.time.toDate().getTime() <= Date.now() && member.userId != userId">
                <UserRating
                  :memberId="member.userId"
                  v-if="!ratedMembers.includes(member.userId)"
                  @rateMember="rateMember"
                ></UserRating>
                <div v-else>You have already rated this user.</div>
              </div>
            </li>
          </ul>
        </div>

        <div class="col2">
          <!-- second column displays comment section -->
          <h1>Comments:</h1>

          <!-- Ideally, we want this div to be of fixed size and scrollable, and always showing the bottom comment -->
          <div v-if="postComments.length" class="comments" id="comments-container">
            <div
              v-for="comment in postComments"
              :key="comment.id"
              :class="comment.userId == userId ?'comments self':'comments others'"
            >
              <UserProfilePicture :userId="comment.userId" class="picture" id="message"/>
              <h5 class="name">{{ comment.userName }} {{ comment.lastName }}</h5>
              <span class="time">{{ comment.createdOn | formatDateFromNow }}</span>
              <p>{{ comment.content }}</p>
            </div>
            </div>

          <div v-else>This post has no comments.</div>


          <form @submit.prevent>
            <textarea v-model.trim="comment"></textarea>
            <button
              @click="postComment()"
              :disabled="comment === ''"
              class="button"
            >
              Post
            </button>
          </form>
        </div>
      </section>
    </div>

    <div v-else>You are not allowed to view this post.</div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import IngredientDisplay from "@/components/IngredientDisplay.vue";
import UserRating from "@/components/UserRating.vue";
import UserProfilePicture from "@/components/UserProfilePicture"


export default {
  title: 'Eat & Meet - View Post Board',

  data() {
    return {
      comment: "",
    };
  },

  props: {
    postId: {},
  },

  components: {
    IngredientDisplay,
    UserRating,
    UserProfilePicture
  },

  methods: {
    ...mapActions(["addComment", "rateUser","takeCareOfIngredient"]),

    postComment() {
      this.addComment({
        content: this.comment,
        postId: this.post.id,
      });

      this.comment = "";
    },

    rateMember(info) {
      this.rateUser({
        rating: info.rating,
        memberId: info.memberId,
        postId: this.post.id,
      });
    },

    // BRING INGREDIENTS
    canBring(ing){// return true if you can take care of the ingredient
    let res = false
      if(!ing) res = false;
      else if(ing.bringerId === undefined || ing.bringerId === '')
        res =   true;
      return res
    },
    userName(userId){ // returns the username with the Id of the user
      const postMembers = this.members
      let user = postMembers.find((el)=> el.userId === userId)
      if(user) return user.userName;
      return "user left"
    },
    // EVENTS
    bringIngredient(ing){ // 'click' event handler for button to tell you are bringing the ingredient
      if(this.canBring(ing)){

        this.takeCareOfIngredient({postId:this.postId, ing:ing, cancel:false})
        .then(()=>{console.log("Ingredient updated, user is now taking care of this ingredient");})
        .catch((err) => {
          console.log(err.name + " "+ err.message);
        });
      }else{
        console.log("Ingredient is already taken care of");
      }
    },
    cancelBringingIngredient(ing){// 'click' event handler for button to tell you are bringing the ingredient
      if(this.canBring(ing)){
        console.log("Cannot cancel ingredient that is not taken");
        return;
      }else if(ing.bringerId !== this.userId){
        console.log("Cannot cancel ingredient that is not yours");
        return;
      }
      this.takeCareOfIngredient({postId:this.postId, ing:ing, cancel: true})
        .then(()=>{console.log("Ingredient updated, user is not taking care of this ingredient");})
        .catch((err) => {
          console.log(err.name + " "+ err.message);
        });

    }
  },

  computed: {
    ...mapState(["posts", "postMembers", "comments", "userId", "ratings"]),

    post() {
      const allPosts = this.posts;

      let displayedPost = allPosts.find((post) => post.id == this.postId);

      return displayedPost;
    },

    postComments() {
      const allComments = this.comments;

      let filteredComments = allComments.filter(
        (comment) => this.post.id == comment.postId
      );

      return filteredComments;
    },

    members() { // members that participates in the post
      const allMembers = this.postMembers;

      let filteredMembers = allMembers.filter(
        (membership) => this.post.id == membership.postId
      );

      return filteredMembers;
    },

    ratedMembers() {
      const allRatings = this.ratings;

      let ratedMembers = allRatings
        .filter(
          (rating) =>
            this.post.id == rating.postId && this.userId == rating.userId
        )
        .map((rating) => rating.memberId);

      return ratedMembers;
    },
  },
};
</script>

<style lang="scss" scoped>
/* Here you can change the css for comments */

#miniature{
display:block;
}

#message{
display:inline-block;
}

.picture{
  width:30px;
  height:30px;
  text-align:center;
}

.col2{
  max-height:90vh;
}

#comments-container{
  max-height:60%;
  overflow-x:auto;
}

.user{
  display:inline-block;
  padding:1em;
  overflow:wrap;
}

.comments{ // Big div containing the comments
  border-radius: 25px;
  padding:10px;
  padding-top: 1em;
  padding-bottom: 1em;
  margin-top : 1em;
  margin-bottom: 1em;
  text-align:left;
  overflow-wrap:anywhere;

    &.self{
      margin-left:60px;
      background-color:lightgreen;
    }

    &.others{
      margin-right:60px;
      background-color: lightgray;
    }
}

  h5{
  display:inline;
  margin:7px;
}
</style>
