<template>
  <div id="login">
    <PasswordReset
      v-if="showPasswordReset"
      @close="togglePasswordReset()"
    ></PasswordReset>

    <section>
      <div class="col1">
        <h1>🥪Eat&Meet🍔</h1>
        <p>
          Welcome to Eat&Meet, the most wonderful food-based social network!
        </p>
      </div>

      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Please Log In</h1>

          <div>
            <label for="email1">Email</label>
            <input
              v-model.trim="loginForm.email"
              type="text"
              placeholder="john.doe@email.com"
              id="email1"
            />
          </div>

          <div>
            <label for="password1">Password</label>
            <input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="******"
              id="password1"
            />
          </div>

          <p v-if="loginErrorMsg != ''" class="error">{{ loginErrorMsg }}</p>

          <button @click="doLogin()" class="button">Log In</button>

          <div class="extras">
            <a @click="togglePasswordReset()">Forgot Password</a>
            <a @click="toggleForm()">Create an Account</a>
          </div>
        </form>

        <form v-else @submit.prevent>
          <h1>Please Create an Account</h1>

          <div>
            <label for="name">First Name</label>
            <input
              v-model.trim="signupForm.name"
              type="text"
              placeholder="John"
              id="name"
            />
          </div>

          <div>
            <label for="lastName">Last Name</label>
            <input
              v-model.trim="signupForm.lastName"
              type="text"
              placeholder="Doe"
              id="lastName"
            />
          </div>

          <div>
            <label for="email2">Email</label>
            <input
              v-model.trim="signupForm.email"
              type="text"
              placeholder="john.doe@email.com"
              id="email2"
            />
          </div>

          <div>
            <label for="password2">Password</label>
            <input
              v-model.trim="signupForm.password"
              type="password"
              placeholder="Min 6 characters"
              id="password2"
            />
          </div>

          <div>
            <label for="birthday">Birthday</label>
            <input
              v-model.trim="signupForm.birthday"
              type="date"
              id="birthday"
              :max="maxDate"
            />
          </div>

          <div>
            <label for="city">City of residence</label>
            <input
              v-model.trim="signupForm.city"
              placeholder="Your city"
              type="text"
              id="city"
            />
          </div>

          <p v-if="signupErrorMsg != ''" class="error">{{ signupErrorMsg }}</p>

          <button @click="doSignup()" class="button">Sign Up</button>

          <div class="extras">
            <a @click="toggleForm()">Back to Log In</a>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>


<script>
import PasswordReset from "@/components/PasswordReset";
import { mapActions } from "vuex";

export default {
  title: 'Eat & Meet - Login',

  data() {
    return {
      showPasswordReset: false,
      showLoginForm: true,
      loginErrorMsg: "",
      signupErrorMsg: "",


      loginForm: {
        email: "",
        password: "",
      },

      signupForm: {
        name: "",
        lastName: "",
        email: "",
        password: "",
        birthday: "",
        city: "",
      },
    };
  },

  computed: {
    maxDate: function () {
      var date = new Date();
      var dd = date.getDate();
      var mm = date.getMonth() + 1; //January is 0!
      var yyyy = date.getFullYear() - 18;

      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }

      return yyyy + "-" + mm + "-" + dd;
    },
  },

  components: {
    PasswordReset,
  },

  methods: {
    ...mapActions(["login", "signup"]),

    doLogin() {
      this.login({
        email: this.loginForm.email,
        password: this.loginForm.password,
      }).catch((err) => {
        this.loginErrorMsg = err.message;
        setTimeout(() => {
          this.loginErrorMsg = "";
        }, 4000);
      });
      
    },

    doSignup() {

      if (this.signupForm.email == "" || this.signupForm.password == "" || this.signupForm.name == "" || this.signupForm.lastName == "" || this.signupForm.birthday == "" || this.signupForm.city == "") {
        this.signupErrorMsg = "Please fill in all the fields";
        setTimeout(() => {
          this.signupErrorMsg = "";
        }, 4000);
        return
      }

      var millisec = Date.parse(this.signupForm.birthday);
      var date = new Date(millisec);

      this.signup({
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.capitalize(this.signupForm.name),
        lastname: this.capitalize(this.signupForm.lastName),
        birthday: date,
        city: this.signupForm.city.toLowerCase(),
      }).catch((err) => {
        this.signupErrorMsg = err.message;
        setTimeout(() => {
          this.signupErrorMsg = "";
        }, 4000);
      });
    },

    capitalize(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },

    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
    },

    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>