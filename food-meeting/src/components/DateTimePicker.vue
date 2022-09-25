<template>
    <div>
        <!-- support dtl -->
        <div v-if="dtlSupport"> 
            <label :for="_id"><slot> Pick a date & time</slot></label>
            <input :id="_id" 
                    v-model.trim="dtlMeatingDate"
                    :min="_minDate"
                    v-on:change="changeOnDTL"
                    type="datetime-local">
        </div>


        <!-- doesn't support dtl -->
        <div v-else> 
            <label :for="_id"><slot> Pick a date & time</slot></label>
            <input :id="_id" v-model="meatingDate" :min="minDate" v-on:change="changeOnDate" type="date">
            <input :id="idTime" v-model="meatingTime" v-on:change="changeOnTime" type="time" >
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            dtlSupport: false, // true if datetime-local is
            minDate:new Date().toString(),
            dtlMeatingDate: null,
            meatingDate: null,
            meatingTime: null
        }
    },
    computed:{
        idTime(){
            return this._id +"_time"
        },
        dateFromDateAndTime(){
            let pickDatemilisec = this.meatingDate + "T"+ this.meatingTime
            return new Date(pickDatemilisec)
        }
    },
    methods:{
        // returns true if brother supports datetime-local
        datetime_localSupport(){
            let i = document.createElement("input")
            i.setAttribute("type","datetime-local")
            return i.type !== "text"
        },
        // EVENTS FOR THE INPUT
        changeOnDTL(event){ // 'change' event handler for datetime-local
            if(this.dtlMeatingDate !== null)
                this.sendDateToParent(new Date(this.dtlMeatingDate))
            else
                console.log("INFO : DateTimePicker changeonDTL dtlMeatingDate is null")
        },
        changeOnDate(event){ // 'change' event handler for the date
            if(this.meatingTime !== null && this.meatingDate !== null)
                this.sendDateToParent(this.dateFromDateAndTime)
            else
                console.log("INFO : DateTimePicker changeOnDate meatingTime or meatingDate is null");
        },
        changeOnTime(envent){ // 'change' event handler for the time
            if(this.meatingDate !== null && this.meatingTime !== null)
                this.sendDateToParent(this.dateFromDateAndTime)
            else
                console.log("INFO : DateTimePicker changeOnTime meatingDate or meatingTime is null");
        },
        sendDateToParent(pDate){ // send the date to the parent
            this.$emit('datePicked',pDate)
        }
    },
    props:{
        _id:{type: String}, // id of the input : datetime-local, date, id of time is derived from it
        _minDate:{type: String} // min date, format : "yyyy-mm-ddThh:mm"
    },
    created(){ // Setting the correct attributes values
        // check if datetime-local is supported
        this.dtlSupport = this.datetime_localSupport()

        // send to parent the default date
        if(this._minDate !== undefined){
            this.sendDateToParent(new Date(this._minDate))
        }

        // setting the values
        if(this.dtlSupport){ // if datetime-local supported
            this.dtlMeatingDate = this._minDate
        }
        else{
            // Correcting the time format
            let i = this._minDate.indexOf("T")
            this.meatingDate = this._minDate.substring(0,i) // getting only the date
            this.meatingTime = this._minDate.substring(i+1) // getting only the time
            this.minDate = this.meatingDate // minimum value
        }
    }
}
</script>