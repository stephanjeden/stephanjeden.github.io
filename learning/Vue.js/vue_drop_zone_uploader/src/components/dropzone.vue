

<template>
  <div id="file-drag-drop">
    <div id="blueBox" class="blueBoxNormalAppearance">
      <form id="dropFormID" class ref="fileform">
        <span
          id="dropFiles"
          class="dropFiles"
          v-show="uploadPercentage == 0 && incorrectFileType != true"
        >Drag and drop your CSV file here to upload it.</span>
        <span class v-show="incorrectFileType == true">Whoops! I can only eat CSV files!</span>
        <span
          class="dropFiles munching"
          v-show="uploadPercentage > 0 && uploadCompleted != true"
        >Munching...</span>
        <span
          id="completedMessage"
          class
          v-show="uploadPercentage > 99 && uploadCompleted == true"
        >{{uploadMessage}}</span>
        <img id="dropIcon" class="dropIconHidden" src="../assets/dropicon.png" height="90vh" />
      </form>
    </div>

    <progress
      max="100"
      :value.prop="uploadPercentage"
      v-show="uploadPercentage > 0 && uploadPercentage < 100"
    ></progress>
  </div>
</template>

<script>
import axios from "axios";

export default {
  /* These are the variables we'll use for the drag and drop component. */
  data() {
    return {
      dragAndDropCapable: false,
      files: [],
      uploadPercentage: 0,
      uploadMessage: "",
      uploadCompleted: false,
      incorrectFileType: undefined
    };
  },

  mounted() {
    /*
    Determine if drag and drop functionality is capable in the browser
    */
    this.dragAndDropCapable = this.determineDragAndDropCapable();

    /*
    If drag and drop capable, then we continue to bind events to our elements.
    */
    if (this.dragAndDropCapable) {
      /*
      Listen to all of the drag events and bind an event listener to each
      for the fileform.
    */
      [
        "drag",
        "dragstart",
        "dragend",
        "dragover",
        "dragenter",
        "dragleave",
        "drop"
      ].forEach(
        function(evt) {
          /*
        For each event add an event listener that prevents the default action
        (opening the file in the browser) and stop the propagation of the event (so
        no other elements open the file in the browser)
      */
          this.$refs.fileform.addEventListener(
            evt,
            function(e) {
              e.preventDefault();
              e.stopPropagation();
            }.bind(this),
            false
          );
        }.bind(this)
      );

      /*
    Add an event listener for drop to the form
    */
      this.$refs.fileform.addEventListener(
        "drop",
        function(e) {
          /*
    Capture the files from the drop event and add them to our local files
    array.
    */
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            /* Validate the file type to make sure only CSV files are uploaded. */
            if (e.dataTransfer.files[i].name.match(/.csv||.CSV/g) != null) {
              this.incorrectFileType = false;
              this.files.push(e.dataTransfer.files[i]);

              /*
    Instantly upload files
    */
              this.submitFiles();
            } else {

              /* Update variables to ensure the user sees the correct message if they upload a second file without reloading the page first. */
              this.incorrectFileType = true;
              this.uploadCompleted = false;
              this.uploadPercentage = 0;
            }
          }
        }.bind(this)
      );
    }

    /* 
    __________________________________

    Stop default behavior and animate drop zone. 
    __________________________________

    */

    window.addEventListener("drop", stopDefaultBehaviorOfDragOnWindow);
    window.addEventListener("dragover", stopDefaultBehaviorOfDragOnWindow);

    function stopDefaultBehaviorOfDragOnWindow(e) {
      e.preventDefault();
    }

    const dropZoneBGConst = document.getElementById("blueBox");
    const dropZoneForm = document.getElementById("dropFormID");
    const dropFilesConst = document.getElementById("dropFiles");
    const dropIconConst = document.getElementById("dropIcon");
    const completedMessage = document.getElementById("completedMessage");

    dropZoneBGConst.addEventListener("dragenter", dragEnterAnimationsFunction);

    function dragEnterAnimationsFunction() {
      this.classList.toggle("blueBoxAnimations");
      dropZoneForm.classList.toggle("formAnimations");
      dropFilesConst.classList.toggle("hideDropFiles");
      dropIconConst.classList.toggle("unhideDropIcon");
      completedMessage.classList.add("hideCompletedMessage");
    }

    dropZoneForm.addEventListener("drop", dropAndLeaveAnimationFunction);

    function dropAndLeaveAnimationFunction() {
      dropZoneBGConst.classList.remove("blueBoxAnimations");
      dropFilesConst.classList.remove("hideDropFiles");
      this.classList.remove("formAnimations");
      dropIconConst.classList.remove("unhideDropIcon");
      completedMessage.classList.remove("hideCompletedMessage");
    }

    dropZoneForm.addEventListener("dragLeave", dragLeaveAnimationFunction);

    function dragLeaveAnimationFunction() {
      dropZoneBGConst.classList.remove("blueBoxAnimations");
      dropFilesConst.classList.remove("hideDropFiles");
      this.classList.remove("formAnimations");
      dropIconConst.classList.remove("unhideDropIcon");
      completedMessage.classList.remove("hideCompletedMessage");
    }
  },

  methods: {
    /*
    Determines if the drag and drop functionality is in the
    window
    */
    determineDragAndDropCapable() {
      /*
    Create a test element to see if certain events
    are present that let us do drag and drop.
    */
      var div = document.createElement("div");

      /*
    Check to see if the `draggable` event is in the element
    or the `ondragstart` and `ondrop` events are in the element. If
    they are, then we have what we need for dragging and dropping files.

    We also check to see if the window has `FormData` and `FileReader` objects
    present so we can do our AJAX uploading
    */
      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },

    /*
    Submits the files to the server
    */
    submitFiles() {
      /* Provide context for this (used for upload completion messages below) */
      let submitFilesAlias = this;

      /* Reset values of uploadCompleted and uploadPercentage so that the user see the correct messages if they upload a second file without reloading the page. */
      this.uploadCompleted = false;
      this.uploadPercentage = 0;

      /*
    Initialize the form data
    */
      let formData = new FormData();

      /*
    Iteate over any file sent over appending the files
    to the form data.
    */
      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];

        formData.append("files[" + i + "]", file);
      }

      /*
    Make the request to the POST /file-drag-drop URL
    */
      axios
        .post("http://mockbin.com/request?foo=bar&foo=bax", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: function(progressEvent) {
            this.uploadPercentage = parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          }.bind(this)
        })
        .then(function() {
          submitFilesAlias.uploadMessage = "All done. Yum!";
          submitFilesAlias.uploadCompleted = true;
        })
        .catch(function() {
          submitFilesAlias.uploadCompleted = true;
        });
    }
  }
};
</script>

<style>
.blueBoxNormalAppearance {
  transition: all 0.3s ease-in;
  background: #0483e5;
  width: 50vw;
  margin: auto;
  margin-top: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 3vh;
  padding-bottom: 3vh;
  border-radius: 10px;
}

.blueBoxAnimations {
  background-color: #0483e591;
  width: 55vw;
  padding-top: 5vh;
  padding-bottom: 5vh;
}

.dropFiles {
  transition: all 0.3s ease-in;
  display: block;
  opacity: 1;
}

.hideDropFiles,
.dropIconHidden,
.hideCompletedMessage {
  display: block;
  position: absolute;

  opacity: 0;
  transition: all 0.3s ease-in;
}

.munching {
  animation-name: munchGrow;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes munchGrow {
  0% {
    font-size: inherit;
  }
  50% {
    font-size: 1.1em;
  }
  100% {
    font-size: inherit;
  }
}

.unhideDropIcon {
  display: block;
  opacity: 1;
  animation-name: iconBounce;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes iconBounce {
  0% {
    margin-top: 0;
  }
  50% {
    margin-top: 2vh;
  }
  100% {
    margin-top: 0;
  }
}

form {
  display: block;
  height: 40vh;
  width: 47vw;
  text-align: center;
  line-height: 400px;
  font-size: 1.6vw;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 10px dotted #9bcb43;
  align-self: center;
  transition: all 0.3s ease-in;
}

.formAnimations {
  border: 15px dotted #9bcb43a1;
  height: 44vh;
  width: 50vw;
}

div.file-listing {
  width: 400px;
  margin: auto;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

div.file-listing img {
  height: 100px;
}

div.remove-container {
  text-align: center;
}

div.remove-container a {
  color: red;
  cursor: pointer;
}

a.submit-button {
  display: block;
  margin: auto;
  text-align: center;
  width: 200px;
  padding: 10px;
  text-transform: uppercase;
  background-color: #ccc;
  color: white;
  font-weight: bold;
  margin-top: 20px;
}

progress {
  width: 400px;
  margin: auto;
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

.drop-files::after {
  content: " ";
  background-image: url("../assets/dropicon.png");
  height: 15vh;
  display: flex;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
}
</style>