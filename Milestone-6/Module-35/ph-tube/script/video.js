function getTime(time) {
  // get hours and rest seconds
  const hour = parseInt(time / 3600);
  let remainingSecond = time % 3600;
  let minute = parseInt(remainingSecond % 60);
  remainingSecond = remainingSecond % 60;
  return `${hour}hour ${minute} minutes ${remainingSecond} second ago`;
}
// remove active btn
const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  console.log(buttons);
  for (let btn of buttons) {
    btn.classList.remove("active");
  }
};

// Fetch, load and show categories on html
// create loadCatagories fetch
const loadCatagories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};
// fetch api videos
const loadVideos = (searchText = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => displayVideo(data.videos))
    .catch((error) => console.log(error));
};
const loadCategoryVideos = (id) => {
  // alert(id);
  //fetch
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      //all btn active class remove koro
      removeActiveClass();

      // id er active class
      const activeBtn = document.getElementById(`btn-${id}`);
      // console.log(activeBtn);
      activeBtn.classList.add("active");
      displayVideo(data.category);
    })
    .catch((error) => console.log(error));
};
const loadDetails = async (videoId) => {
  // console.log(videoId);
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(url);
  const data = await res.json();
  // console.log(data)
  displayDetails(data.video);
};
const displayDetails = (video) => {
  const detailsContainer = document.getElementById("modal-content");
  detailsContainer.innerHTML = `
   <img src = ${video.thumbnail} />
   <p>${video.description} </p>
   `;

  //way 1
  document.getElementById("showModalData").click();
  //way2
  /* document.getElementById("customModel").showModel(); */
};
// fetch api videos display
const displayVideo = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
     <div class="min-h-[300px]  flex flex-col gap-5 justify-center items-center ">
      <img src="asset/Icon.png"/>
      <h2 class="text-center text-xl font-bold" > No Content Here in this Category
      </h2>
     </div>
    `;
    return;
  } else {
    videoContainer.classList.add("grid");
  }

  videos.forEach((video) => {
    console.log(video);
    const card = document.createElement("div");
    card.classList = "card card-compact";
    card.innerHTML = `
    <figure class="h-[200px] relative">
    <img src="${
      video.thumbnail || "pic link"
    }" class="h-full w-full object-cover" alt="Shoes" />
     ${
       video.others.posted_date?.length == 0
         ? ""
         : ` <span class="absolute right-2 bottom-2 bg-black rounded p-1 text-white text-sm ">${getTime(
             video.others.posted_date
           )} </span>`
     }
   
  </figure>
  <div class="px-0 py-2 flex gap-2">
    <div>
       <img class="w-10 h-10 rounded-full object-cover" src=${
         video.authors[0].profile_picture
       } />
    </div>
    <div>
      <h2 class="font-bold">${video.title} </h2>
      <div class="flex items-center gap-2"> 
        <p class="text-gray-400">${video.authors[0].profile_name} </p>
         ${
           video.authors[0].verified === true
             ? `<img class="w-5" src = "https://img.icons8.com/?size=100&id=D9RtvkuOe31p&format=png&color=000000"`
             : ""
         }
      </div>
      <p> 
      <button onclick="loadDetails('${
        video.video_id
      }')"class="btn btn-sm btn-error">details
        </button> 
      </p>
    </div>
  </div>`;
    videoContainer.append(card);
  });
};
// create displayCategories fetch
const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("category-container");
  categories.forEach((item) => {
    //   console.log(item);
    //create a button
    const buttonContainer = document.createElement("div");
    /* button.classList = "btn";
    button.innerText = item.category; */
    buttonContainer.innerHTML = `
     <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">${item.category}</button>
    `;

    // add button to category container
    categoriesContainer.append(buttonContainer);
  });
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
  // console.log(e.target.value);
  loadVideos(e.target.value);
});

loadCatagories();
loadVideos();
