<template>
    <div id="createPost">
      <h1>Create a nice Post for your Meal</h1>
        <section>
            <CreateMealPost></CreateMealPost>
        </section>
    </div>
</template>

<script>
import CreateMealPost from '@/components/CreateMealPost'

export default {
  title: 'Eat & Meet - Create Post',

  data() {
    return {
      
    };
  },
  
  components: {
      CreateMealPost
  }
};
</script>

<style lang="scss" scoped>

</style>