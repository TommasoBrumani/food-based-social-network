<template>
  <div>
    <p>
      Rate your experience with this user:

      <input type="radio" id="good" value="Good" v-model="rating" />
      <label for="good">Good </label>
      <input type="radio" id="mixed" value="Mixed" v-model="rating" />
      <label for="mixed">Mixed </label>
      <input type="radio" id="bad" value="Bad" v-model="rating" />
      <label for="bad">Bad </label>

      <button @click="rateMember()" :disabled="!rating || rated">Rate</button>
    </p>
  </div>
</template>

<script>

export default {
  data() {
    return {
      rating: "",
      rated: false
    };
  },

  methods: {
    rateMember() {
      this.$emit("rateMember", {
        rating: this.rating,
        memberId: this.memberId
      })

      this.rated = true
    }
  },

  props: {
    memberId: {type: String},
  },

  computed: {},
};
</script>

<style scoped>
</style>