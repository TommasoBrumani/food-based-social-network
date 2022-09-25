<template>
  <section id="createMealPost">
    <div class="col1">
      <h3>General information for your meal</h3>
      <form @submit.prevent>
        <!-- title -->
        <div>
          <label for="mealForm_title">Your meal title (required):</label>
          <input
            id="mealForm_title"
            type="text"
            v-model.trim="mealForm.title"
            required="true"
            placeholder="A nice Indian meal in Paris"
          />
        </div>

        <!-- location
        // for now it will be the city name
        // TODO GeoPoints and city name-->
        <div>
          <label for="formMeal_city">City where the meal takes place (required)</label>
          <input id="formMeal_city" type="text" v-model.trim="mealForm.cityName" placeholder="E.g Paris" required="true">
        </div>

        <!-- number of participant-->
        <div>
          <label for="mealForm_numParticipant">
            Number of participants including yourself (required):
          </label>
          <input
            id="mealForm_numParticipant"
            v-model.number="mealForm.numParticipant"
            type="number"
            min="2"
            oninput="validity.valid||(value='')"
            placeholder="Minimum of 2"
            required="true"
          />
        </div>

        <DateTimePicker _id="formMeal_time" :_minDate="minDate" @datePicked="onDatePicked">
          Time of the meeting (required):
        </DateTimePicker>

        <!-- description-->
        <div>
          <label for="formMeal_description"
            >Description of your meal (appetizer, meal, dessert, etc.):</label
          >
          <textarea
            id="formMeal_description"
            v-model.trim="mealForm.description"
            cols="30"
            rows="10"
            placeholder="E.g. a two-course meal, made up by roasted beef and..."
          ></textarea>
        </div>

        <!-- recipe-->
        <div>
          <label for="formMeal_recipe">Write your recipe(s) here:</label>
          <textarea
            id="formMeal_recipe"
            v-model.trim="mealForm.recipe"
            cols="30"
            rows="10"
            placeholder="E.g. fry the meat in a pan for 10 minutes, then..."
          ></textarea>
        </div>

        <transition name="fade">
          <p v-if="showError" class="error-msg">{{ errorMsg }}</p>
        </transition>

        <button @click="createPost()" class="button">Post my meal</button>
      </form>
    </div>

    <!-- The ingredients zone -->
    <div class="col2">
      <Ingredient @sendNewIngredient="addIngredient"></Ingredient>

      <h3>List of current ingredients</h3>
      <!-- if there are ingredients to display -->
      <ul v-if="mealForm.ingredients.length !== 0">
        <li v-for="ing in mealForm.ingredients" :key="ing.name">
          <IngredientDisplay :ingredient="ing"></IngredientDisplay>
          <button class="deleteIngButton" @click="deleteIngredient(ing)">Delete</button>
        </li>
      </ul>

      <!-- if there are no ingredients to display -->
      <p v-else> No ingredients.</p>

    </div>
  </section>
</template>

<script>
// Component import
import Ingredient from '@/components/Ingredient.vue';
import IngredientDisplay from '@/components/IngredientDisplay.vue';
import DateTimePicker from '@/components/DateTimePicker.vue'

export default {

  data() {
    return {
      errorMsg: "Please fill in all required fields.",
      showError: false,
      mealForm: {
        title: "",
        numParticipant: { type: Number },
        recipe: "",
        ingredients: [],
        time: "",
        cityName: "",
        description: "",
      },
    };
  },

  components: { 
    Ingredient,
    IngredientDisplay,
    DateTimePicker
  },
  computed: {
    minDate: function () {  // datetime-local format : yyyy-mm-ddThh:mm
      let today = new Date();
      let tomorrow = new Date(today.getTime() + 1000* 60 * 60 *24);
      let dd = this.addZeroToTime(tomorrow.getDate());
      let mm = this.addZeroToTime(tomorrow.getMonth() + 1); //January is 0!
      let yyyy = tomorrow.getFullYear();
      let hh = this.addZeroToTime(tomorrow.getHours());
      let min = this.addZeroToTime(tomorrow.getMinutes());

      tomorrow = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + min;
      return tomorrow;
    }
  },

  methods: {

    lowercase(value){ // returns a string in all lower case
      if(!value) return '';
      value = value.toString()
      return value.toLowerCase();
    },

    addZeroToTime(t){
      return (t<10) ? "0"+ t : t
    },

    createPost() {
      this.errorMsg ="Please fill in all required fields. Missing fields : "
      let missingFields = []
      if (this.mealForm.title == ""){
        missingFields.push("Meal title")
      }
      if( this.mealForm.numParticipant <= 1 || typeof this.mealForm.numParticipant !== "number"){
        missingFields.push("Number of participants")
      }

      let d = new Date(this.mealForm.time)
      if(isNaN(d.getTime())){
        missingFields.push("Time of the meeting")
      }
      if(this.mealForm.cityName == ""){
        missingFields.push("City name")
      }

      // Show the error
      if(missingFields.length > 0){

        this.showError = true
        for(let i=0;i<missingFields.length;i++) // todo
          this.errorMsg = this.errorMsg + '-' + missingFields[i] +' '

        this.errorMsg = this.errorMsg.substring(0,this.errorMsg.length)
        setTimeout(() => {this.showError = false;}, 5000);

      }
      else { // No error, adding the ingredient

        let millisec = Date.parse(this.mealForm.time);
        let date = new Date(millisec);

        this.$store.dispatch("createMealPost", {
          title: this.mealForm.title,
          numParticipant: this.mealForm.numParticipant,
          recipe: this.mealForm.recipe,
          time: date,
          cityName: this.lowercase(this.mealForm.cityName),
          description: this.mealForm.description,
          ingredients: this.mealForm.ingredients
        });

        this.$router.push("/");

      }
    },

    // Events
    deleteIngredient(ingredient){ // 'click' event handler for button
      let tab = this.mealForm.ingredients.filter(ing => ing != ingredient); // create a new array with ingredients different from `ingredient`
      this.mealForm.ingredients = tab
    },

    addIngredient(ingredient) { // 'sendNewIngredient' event handler for Ingredient
      this.mealForm.ingredients.push(ingredient)
    }, 

    onDatePicked(datePicked){ // 'deleteIng' event handler for DateTimePicker
      if(!datePicked)
        console.log("ERROR: CreateMealPost datePicked is null");
      else
        this.mealForm.time = datePicked
    }
    
  },
};
</script>