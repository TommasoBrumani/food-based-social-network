<template>
    <div class=IngredientDisplay>
            <span class="ingName">{{ ingredient.name }}</span>
            <span class="ingQuantity"> x {{ ingredient.quantity }}</span>
            <span class="ingUnit">{{ ingredient.unit }} </span>
    </div>
</template>

<script>
export default {

    data() {
        return {}
    },

    methods: {},

    props: {
        ingredient: {
            name: "",
            quantity: {type: Number},
            unit: ""
      }
    }
}
</script>

<style lang="scss" scoped>

</style>
