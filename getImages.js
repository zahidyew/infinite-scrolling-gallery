const mainElem = document.getElementById("main");
const rowElem = document.getElementsByClassName("row");
const columnElem = document.getElementsByClassName("column");
const searchElem = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");

var tag = "cats";
var page = 1;
var perPage = 30;
var orientation = "landscape";
var moreCounter = 0;
var fetchIsDone = false;

searchBtn.addEventListener("click", () => {
   searchNewImages();
});

fetchImages(tag, page, perPage, orientation, false)

function fetchImages(tag, page, perPage, orientation, moreFlag) {
   fetch(`https://infinite-scrolling-gallery.herokuapp.com/api/getPhotos?tag=${tag}&page=${page}&perPage=${perPage}&orientation=${orientation}`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
      },
   })
      .then((response) => response.json())
      .then((data) => {
         console.log('Success:', data);
         getDataSize(data, moreFlag);
      })
      .catch((error) => {
         console.error('Error:', error);
      });
}

function getDataSize(data, moreFlag) {
   const size = Object.keys(data.results).length;

   for (let i = 0; i < size; i++) {
      displayImages(data.results[i], i, moreFlag);
   }
}

function displayImages(data, i, moreFlag) {
   const imageElem = document.createElement("img");
   imageElem.src = data.urls.regular + "&h=480";

   if(moreFlag === false) {
      columnElem[i].appendChild(imageElem);
   }
   else{ // user has scrolled to the bottom and more images should be displayed
      if(i == 0 || i % 3 == 0) { // make new row for each 3 images as a row has 3 cols
         const cloneRowElem = rowElem[0].cloneNode(true);

         clearRowImages(cloneRowElem);
         mainElem.appendChild(cloneRowElem);
      }
      let x = i + (moreCounter * perPage);
      columnElem[x].appendChild(imageElem);
   }

   imageElem.addEventListener("click", () => {
      window.open(data.urls.full);
   })

   fetchIsDone = true;
}

function searchNewImages() {
   page = 1;
   moreCounter = 0;

   if (searchElem.value == "") {
      alert("Search box is empty.");
   }
   else if (searchElem.value == tag) {
      // nothing to do if its same. Don't waste bandwidth.
   }
   else {
      tag = searchElem.value;

      //deleteClonedRows();
      clearImages();
      fetchImages(tag, page, perPage, orientation, false)
   }
}

function loadMoreImages() {
   page = page + 1;
   moreCounter++;

   fetchImages(tag, page, perPage, orientation, true)
}

function clearImages() {
   let x = document.getElementsByTagName("img");
   let size = x.length;

   for (let i = 0; i < size; i++) {
      x[0].remove();
   }
}

function clearRowImages(clonedRow) {
   let x = clonedRow.getElementsByTagName("img");
   let size = x.length;

   for (let i = 0; i < size; i++) {
      x[0].remove();
   }
}

document.addEventListener('keyup', () => {
   // ENTER key is pressed
   if (event.keyCode === 13) {
      searchNewImages();
   }
});

window.addEventListener("scroll", () => {
   const scrollable = document.documentElement.scrollHeight - window.innerHeight;
   const scrolled = window.scrollY;

   //maybe add another condition here whereby fetch req much be done 1st b4 calling loadMoreImages() to avoid spamming api
   if(Math.ceil(scrolled) === scrollable && fetchIsDone === true) { 
      fetchIsDone = false;

      console.log("Bottom");
      loadMoreImages();
   }
});


/* function deleteClonedRows() {
   let size = rowElem.length;

   for (let i = size; i > 30; i++) {
      rowElem[i-1].remove();
   }
} */

/*function displayImages(data, i) {
   const imageElem = document.createElement("img");
   imageElem.src = data.urls.regular + "&h=480";

   if (i < 3) {
      columnElem[i].appendChild(imageElem);
   }
   else { // dynamically add new div by cloning the "row div"
      if (i % 3 == 0) {
         const cloneRowElem = rowElem[0].cloneNode(true);
      }
      let r = i % 3;
      columnElem[r].appendChild(imageElem);
   }

   imageElem.addEventListener("click", () => {
      window.open(data.urls.full);
   })
}*/

