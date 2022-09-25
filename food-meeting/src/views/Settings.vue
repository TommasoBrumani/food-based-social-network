<template>
  <section id="settings">
    <h3>Settings</h3>
    <h4>Update your profile</h4>
    <div class="col1">

      <transition name="fade">
        <p v-if="showSuccess" class="success">Profile updated</p>
      </transition>

      <!-- Profile picture update -->
      <h5>Update your profile picture</h5>
      <label for="img_profile-picture"> Your current profile picture </label>
      <UserProfilePicture id="img_profile-picture" :userId="uid"/>
      <!-- form to send image -->
      <form id="profile-picture_form" @submit.prevent>
        <input id="mediaCapture" type="file" accept="image/*" capture="camera" v-on:change.prevent="onMediaFileSelected">
        <button id="submitImage" title="Add an image" class="button" v-on:click.prevent="confirmSending" :disabled="buttonDisable">
          Submit image
        </button>
        <!-- displays an error message -->
        <transition name="fade">
          <p v-if="showError" class="error-msg">{{ errorMsg }}</p>
        </transition>
      </form>
    </div>

      <!-- General information update -->
    <div class="col2">
       <h5>Update your general informations</h5>
      <form id="general-info_form" @submit.prevent>
        <label for="name">First Name</label>
        <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />

        <label for="lastName">Last Name</label>
        <input v-model.trim="lastName" type="text" :placeholder="userProfile.lastName" id="lastName" />

        <label for="birthday">Birthday</label>
        <input v-model.trim="birthday" :placeholder="userProfile.birthday | formatDate" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="birthday" :max="maxDate"/>

        <label for="city">City of residence</label>
        <input v-model.trim="city" :placeholder="userProfile.city" type="text" id="city" />

        <button @click="setProfile()" class="button">Update Profile</button>
      </form>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import UserProfilePicture from "@/components/UserProfilePicture"

export default {
  title: 'Eat & Meet - Settings',

  data() {
    return {
      name: '',
      lastName: '',
      birthday: '',
      city: '',

      showSuccess: false, // used for general-info_form
      // image form
      imageFormElement:{},
      errorMsg:'',
      showError: false,
      buttonDisable: true,
      file: null
    }
  },
  components:{
    UserProfilePicture
  },
  computed: {
    ...mapState({userProfile:'userProfile',uid: 'userId'}),

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
  methods: {
    ...mapActions(['uploadProfilePicture', 'updateProfile']),

    setProfile() {
      let oldDate = this.userProfile.birthday.toDate()
      let millisec = Date.parse(this.birthday)
      let date = new Date(millisec)

      this.updateProfile( {
        name: this.name !== '' ? this.name : this.userProfile.name,
        lastName: this.lastName !== '' ? this.lastName : this.userProfile.lastName,
        birthday: this.birthday !== '' ? date : oldDate,
        city: this.city !== '' ? this.city : this.userProfile.city,
      })

      this.name = ''
      this.lastName = ''
      this.birthday = ''
      this.city = ''
      this.showSuccess = true

      setTimeout(() => {
        this.showSuccess = false
      }, 2000)
    },

    resetFilePicked(){ // reset the selection
      this.imageFormElement.value = this.imageFormElement.defaultValue // reset the selection
      this.file = null
    },

    async displayError(msg,time=10000){
      if(!msg || msg == '') return
      this.showError = true;
      this.errorMsg = msg
      setTimeout(()=>{this.showError= false}, time)
    },

    // EVENTS
    onMediaFileSelected(event) { // 'change' event handler for the file input
      event.preventDefault();
      let file = event.target.files[0];
      this.showError = false; // reset error
      this.buttonDisable = true

      // Check if the file is an image.
      if (!file.type.match('image.*')) {
        console.log("ERROR: Settings file isn't an image");
        this.resetFilePicked(); // reset the selection
        this.displayError("Wrong file type, only image are accepted."); // display the error message
        return;
      }
      // Check file size
      if(file.size > 4194304){// we accept up to 4 Mio
        console.log("ERROR: Settings file isn't an image");
        this.resetFilePicked();
        this.displayError("File size is > 4 Mio")
        return;
      }

      this.file = file
      this.buttonDisable = false // no error, we enables the button
    },

    async confirmSending(event){ // 'click' event handler for the file input
      event.preventDefault()
      if(!this.file){
        console.log("ERROR: Settings file is null");
        this.displayError("Please upload a valid image first")
        return;
      }
      // Upload the profile picture on firestore
      let up =  this.uploadProfilePicture(this.file)
        .then((fileSnapshot) =>{
          // 3 - Generate a public URL for the file.
          return fileSnapshot.ref.getDownloadURL().then((url) =>{
            // 4 - Update the user profilePicture property
            this.updateProfile({ profilePicture: url})
          });
        })
        .then(()=> {console.log("Upload profile picture succeed !");})
        .catch((error)=> {console.log(error.name + " " + error.message);})
        this.resetFilePicked();
        return up
    },


  },
  filters: {
    formatDate(val) {
      if (!val) {return '?'}

      var oldDate = val.toDate()
      var month = oldDate.getUTCMonth() + 1
      var day = oldDate.getUTCDate()
      var year = oldDate.getUTCFullYear()

      return day + "/" + month + "/" + year;
    }
  },
  mounted(){
    let doc = document.getElementById("mediaCapture")
    // check if doc is valid
    if(doc) this.imageFormElement = doc
  }
}
</script>
<style lang="scss" scoped>
#settings{
display:flex;
flex-direction:row;
flex-wrap:wrap;
align-items:flex-start;
}

h1,
h2,
h3,
h4,
h5{
display:block;
width:100%;
}
.col1{
flex: 1 3 30%;
margin: 2em;
}
.col2{
background:#ffffff;
flex: 2 1 60%;
margin: 2em;
}
</style>
