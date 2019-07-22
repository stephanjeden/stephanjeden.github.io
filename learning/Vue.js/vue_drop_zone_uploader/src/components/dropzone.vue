<template>
  <div id="file-drag-drop">
    <div id="blueBox" class="blueBoxNormalAppearance">
      
      <form id="dropFormID" ref="fileform">
        <span id="userMessage" class="showUserMessage" >{{ userMessage }}</span>
        <img id="dropIcon" class="dropIconHidden" src="../assets/dropicon.png" height="90vh" />       
      </form>

      <div id="dragTarget" ref="dropTarget"> </div>
      
    </div>

    <label id="buttonFileSelectorLabel" for="inputButton">Or <strong>choose it</strong> here.
      <input id="inputButton" type="file" ref="buttonFileSelector" v-on:change="buttonFileSelectorFunction()"/>
    </label>
  
    <progress
      max="100"
      :value.prop="uploadPercentage"
      v-show="uploadPercentage > 0 && uploadPercentage < 100">
    </progress>

    <div id="displayContactsDiv" class="u-full-width" v-show="userMessage == 'All done. Yum!'" >

    
 
  </div>
  </div>
</template>

<script>

import axios from "axios";
import jquery from "jquery";
import '../../node_modules/skeleton-css/css/skeleton.css';

export default {
  /* These are the variables we'll use for the drag and drop component. */
  data() {
    return {
      dragAndDropCapable: false,
      file: null,
      lines: ``,
      uploadPercentage: 0,
      uploadMessage: "",
      userMessage: "Drop your CSV file here.",
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
      ].forEach( evt => 
        /*
        For each event add an event listener that prevents the default action
        (opening the file in the browser) and stop the propagation of the event (so
        no other elements open the file in the browser)
        */  
        this.$refs.dropTarget.addEventListener(
          evt, e => {e.preventDefault(); e.stopPropagation();}, false
        ),
      );

      /*
      Add an event listener for drop to the form
      */
      this.$refs.dropTarget.addEventListener("drop", this.handleFileDrop);
    }

    /* 
    __________________________________

    Stop default behavior and animate drop zone. 
    __________________________________

    */

    /* Stop default behavior of drag and drop over windown element. */

    window.addEventListener("drop", stopDefaultBehaviorOfDragOnWindow);
    window.addEventListener("dragover", stopDefaultBehaviorOfDragOnWindow);

    function stopDefaultBehaviorOfDragOnWindow(e) {
      e.preventDefault();
    }
    
    this.dropZoneHoverAnimation();

  },

  methods: {

    handleFileDrop(dropEvent) {
      /*
      Capture the files from the drop event and add them to our local files
      array.
      */


      if (dropEvent.dataTransfer.files.length > 1) {
        this.userMessage = "Please upload one file at a time.";
        return;
      }

      this.handleFileSelection(dropEvent.dataTransfer.files[0]);
    },

    handleFileSelection(file) {
       if (!file.name.match(/\.csv$/i)) {
         this.userMessage = "Whoops! I can only eat CSV files!";
         return;
       }
      this.file = file;
      this.submitFiles();
    },


    dropZoneHoverAnimation() {
    
      const dropZoneBGConst = document.getElementById("blueBox");
      const dropZoneForm = document.getElementById("dropFormID");
      const userMessage = document.getElementById("userMessage");
      const dropIconConst = document.getElementById("dropIcon");
      const dragTarget = document.getElementById("dragTarget");

      dragTarget.addEventListener("dragenter", startDragAnimation);
      dragTarget.addEventListener("drop", stopDragAnimation);
      dragTarget.addEventListener("dragleave", stopDragAnimation);

      function startDragAnimation() {
        dropZoneBGConst.classList.add("blueBoxAnimations");
        dropZoneForm.classList.add("formAnimations");
        dropIconConst.classList.add("unhideDropIcon");
        userMessage.classList.add("hideUserMessage");
      }


      function stopDragAnimation() {
        dropZoneBGConst.classList.remove("blueBoxAnimations");
        dropZoneForm.classList.remove("formAnimations");
        dropIconConst.classList.remove("unhideDropIcon");
        userMessage.classList.remove("hideUserMessage");
      }
    },

    startUploadingAnimation() {
      userMessage.classList.add("munching");
    },

    endUploadingAnimation() {
      userMessage.classList.remove("munching");
    },

    /*
    Determines if the drag and drop functionality is in the
    window
    */
    determineDragAndDropCapable() {
      console.log("drag n drop?");
      /*
      Create a test element to see if certain events
      are present that let us do drag and drop.
      */
      const div = document.createElement("div");

      /*
      Check to see if the `draggable` event is in the element
      or the `ondragstart` and `ondrop` events are in the element. If
      they are, then we have what we need for dragging and dropping files.
      We also check to see if the window has `FormData` and `FileReader` objects
      present so we can do our AJAX uploading.
      */

      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },

    buttonFileSelectorFunction() {
      this.handleFileSelection(this.$refs.buttonFileSelector.files[0]);
    },

    displayCsvContents() {
      /* Create new FileReader method instance. */
      const linesAlias = this.lines;
      let localLinesVar = `<h1>Your Contacts:</h1><table class='u-full-width' id='contactsTable'>`;
      const csvFileReader = new FileReader();
      csvFileReader.readAsText(this.file);
      csvFileReader.onload = processData;

      function processData(processedFile) {
        let allTextLines = processedFile.target.result.split(/\r\n|\n/);
        for (const individualLine of allTextLines) {
          let dataInLine = individualLine.split(',');
          if (localLinesVar == "<h1>Your Contacts:</h1><table class='u-full-width' id='contactsTable'>") {
            localLinesVar += "<thead> <tr>";

            for (const aSingleValue of dataInLine) {
              localLinesVar += `<th>${aSingleValue}</th>`;
            }
            localLinesVar += "</tr> </thead><tbody> <tr>";
          } else {
            localLinesVar += "<tr>";
            for (const aSingleValue of dataInLine) {
              localLinesVar += `<td>${aSingleValue}</td>`;
            }
            localLinesVar += "</tr>";
          }
        }
        localLinesVar += "</tr></tbody></table>";
        document.getElementById('displayContactsDiv').innerHTML = `${localLinesVar}`;
      }
    },
    

    submitFiles() {

      this.startUploadingAnimation();

      this.userMessage = "Munching..."
      /*
      Initialize the form data
      */
      let formData = new FormData();

      /*
      Iteate over any file sent over appending the files
      to the form data.
      */
     

      formData.append("file", this.file);
      

      /*
      Make the request to the POST /file-drag-drop URL
      */
      axios.post("https://vuedraganddropper.free.beeceptor.com/my/api/path", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => this.uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
      })
      .then(() => {
        console.log("SUCCESS!!");
        this.userMessage = "All done. Yum!";
        this.uploadCompleted = true;
        this.endUploadingAnimation();
        this.displayCsvContents();
      })
      .catch(() => {
        console.log("FAILURE!!");
        this.userMessage = "Uh-oh, that didn't work. Try again?";
        this.uploadCompleted = true;
        this.endUploadingAnimation();
      });
    }
  }
};
</script>



<style>

#file-drag-drop {
  display: flex;
  flex-direction: column;
  align-items: center;
}

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

#userMessage {
  font-size: 2vmin;
}

.showUserMessage {
  transition: all 0.3s ease-in;
  display: block;
  opacity: 1;
}

.hideUserMessage,
.dropIconHidden {
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
    font-size: 1.07em;
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
  margin-bottom: 0;
}

.formAnimations {
  border: 15px dotted #9bcb43a1;
  height: 44vh;
  width: 50vw;
}

#dragTarget {
  height: 47vh;
  width: 50vw;
  opacity: 0;
  position: absolute;
}

#inputButton {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}

#buttonFileSelectorLabel {
color: #0483e5;
margin-top: 15px;
font-size: 1.6vw;
cursor: pointer;
font-weight: 100;
font-size: 2vmin;
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

#displayContactsDiv h1 {
  font-size: 2.2em;
  margin-top: 33px;
  color: #0483e5;
}

#displayContactsDiv {
  margin: 2vw;
  background: #f4f4f4;
  padding: 0 20px 0 20px;
  color: rgb(124, 124, 124);
}


#contactsTable {
  border-collapse: collapse;
  font-size: 2vmin;
}

#contactsTable thead {
  color: #0483e5;
}

#contactsTable tbody tr:nth-child(even) {
  font-weight: 400;
}
 
</style>