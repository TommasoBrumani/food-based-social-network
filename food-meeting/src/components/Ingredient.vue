<template>
<div>
  <h4>Add a new ingredient for your meal</h4>
  <form @submit.prevent id="ingredientForm">
    <label for="newIngredient_name">Ingredient name</label>
    <input
      id="newIngredient_name"
      type="text"
      v-model.trim="newIngredient.name"
      placeholder="The ingredient's name"
    />
    <label for="newIngredient_quantity">How much</label>
    <input
      id="newIngredient_quantity"
      type="number"
      v-model.number="newIngredient.quantity"
      min="0"
      oninput="validity.valid||(value='')"
      placeholder="The ingredient's quantity"
    />

    <label for="newIngredient_unit">Unit</label>
    <select id="newIngredient_unit" v-model.trim="newIngredient.unit">
      <option disabled value=""> Please select one unit</option>
      <option v-for="option in unitOptions" :value="option.value" :key="option.name">
        {{ option.text}}
      </option>
    </select>

    <br><br> <!--TODO waiting for proper css -->
    
    <button class="button" @click="addIngredient()">Add ingredient</button> 
    <button class="button" @click="cancelIngredient()"> Cancel </button>

    <transition name="fade">
          <p v-if="showError" class="error-msg">{{ errorMsg }}</p>
    </transition>
  </form>
</div>
</template>

<script>
import { relativeTimeThreshold } from 'moment';
export default {
  data() {
    return {
      // Error handling
      errorMsg: "",
      showError:false,

      // Array containing differents value for the `select` of the unit
      unitOptions: [ 
          { text:'Kilogram(s)', value:'kg'},
          { text: 'Gram(s)', value:'g'},
          { text: 'Liters', value:'L'},
          { text: 'MilliLiters', value:'mL'},
          { text:'unit(s)', value:'u'},
      ],

      // Object for the ingredient
      newIngredient: {
        name: "",
        quantity: {type: Number},
        unit: ""
      },
      
    };
  },

  methods: {
      addIngredient() {
          // Error handling
          this.errorMsg ="Please fill in all required fields. Missing fields :"
          this.showError = false
          let missingFields = [] // array containing the display name of the missing field

          if(this.newIngredient.name === ""){
            missingFields.push("`Ingredient name`") // add the missing field
            this.showError = true // Display the error
          }
          if(this.newIngredient.quantity <= 0 || typeof this.newIngredient.quantity !== "number"){
            missingFields.push("`Quantity (must be > 0)`")
            this.showError = true
          }
          if(this.newIngredient.unit === ""){
            missingFields.push("`Unit(kg,L.,..)`")
            this.showError = true
          }

          if(this.showError) {
            for(let i = 0;i< missingFields.length;i++){
              this.errorMsg = this.errorMsg + missingFields[i] +' '
            }
            setTimeout(()=>{this.showError= false},30000) // stop displaying this error after 30 s
            console.log("ERROR : Ingredient : " + this.errorMsg);
            return; // Don't go after if there is a error
          }

          // Emit an event with the ingredient in param
          this.$emit('sendNewIngredient', {
              name: this.newIngredient.name,
              quantity: this.newIngredient.quantity,
              unit: this.newIngredient.unit,
              bringerId:'' // the person bringing the ingredient
          })
          
          console.log("INFO : Ingredient ADDED " + this.newIngredient.name);

          // Reset the ingredient
          this.resetIngredient();
      },
      cancelIngredient(){
        this.resetIngredient();
      },
      resetIngredient(){
        // TODO when {type: Number} add as Object wheras new Number() add as 0 but display a zero
        this.newIngredient.name = ""
        this.newIngredient.quantity = {type: Number}
        this.newIngredient.unit = ""
      }
  }
};
</script>
