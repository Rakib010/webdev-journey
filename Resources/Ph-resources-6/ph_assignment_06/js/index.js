
/*
 * Common Fetcher Function
 *
 */
const fetchData = async (URL, FUNC) => {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    //Embedding the used URL in data
    data.usedUrl = URL;

    //Embedding Error is False in data
    data.error = false;

    //Calling the Render Function using the data
    FUNC(data);
  } catch (error) {
    //Handling ERROR for BONUS MARKS
    console.log(error);

    //Sending Error Object in Render function
    //to indicate some error in UI
    const errorObj = { error: true, message: error.message };
    FUNC(errorObj);
  }
};

/*
 * Fetcher Functions
 *
 */

const fetchCategory = () => {
  categoryURL = "https://openapi.programming-hero.com/api/news/categories";
  fetchData(categoryURL, renderCategory);
};

//Calling fetch category
//when the page is rendering
//for first time
fetchCategory();

const fetchNews = (categoryId) => {
  /*--- EXTRA FEATURE:
   * Switching Category Navigation Indicator
   */

  //Cleaning Active status from all category link
  const ul = this.event.target.parentElement.parentElement;
  Array.from(ul.children).forEach((item) =>
    item.firstElementChild.classList.remove("active")
  );

  //Adding Active status indicator on clicked nav link
  this.event.target.classList.add("active");

  /* EXTRA FEATURE:
   * Hiding Menu if Nav Item is clicked
   * in Mobile View
   */
  const menu = document.querySelector(".navbar-toggler");
  if (menu.getAttribute("aria-expanded")) {
    menu.setAttribute("aria-expanded", false);
    menu.classList.add("collapsed");
    menu.nextElementSibling.classList.remove("show");
  }

  //Showing Loading Spin for Bonus Marks
  //while loading the API
  const categoryNewsURL = `https://openapi.programming-hero.com/api/news/category/${categoryId}`;
  const newsContainer = document.getElementById("news-container");
  newsContainer.innerHTML = `
  <div class="d-flex justify-content-center">
	<div class="loader "></div>
  </div> `;

  //Hiding the number of news available
  //while loading the API
  const numOfNews = document.getElementById("number-of-news");
  numOfNews.textContent = "";

  //Fetching and flowing the data
  //to renderNews function
  fetchData(categoryNewsURL, renderNews);
};

const fetchNewsDetails = (news_id) => {
  const newsModal = document.getElementById("news-modal");
  newsModal.innerHTML = `
  <div class="d-flex justify-content-center">
	<div class="loader "></div>
  </div> `;

  const modalTitle = document.querySelector(".modal-title");
  modalTitle.textContent = "";

  const newsDetailURL = `https://openapi.programming-hero.com/api/news/${news_id}`;
  fetchData(newsDetailURL, renderNewsDetailsInModal);
};

/*
 * Render Functions
 *
 */

function renderCategory({ error, data: { news_category } }) {
  const categoryNav = document.getElementById("category-nav");

  //Showing some Error in UI
  if (error) {
    console.log(error);
    categoryNav.innerHTML += `
              <li class="nav-item">
                <a class="nav-link" aria-current="page" href="#">
					Something Went WRONG 🚫 Check Internet Connection. 📶
				</a>
              </li>`;
    alert("Something went wrong");
    return;
  }
  //Creating Category Nav Links
  news_category.forEach(({ category_id, category_name }) => {
    const template = `
              <li class="nav-item" onclick="fetchNews('${category_id}')">
                <a class="nav-link" aria-current="page" href="#" data-category-id=${category_id}>${category_name}</a>
              </li>
		`;
    categoryNav.innerHTML += template;
  });

  //The first category is active by default
  categoryNav.firstElementChild.firstElementChild.click();
}

function renderNews({ error, data, usedUrl }) {
  const newsContainer = document.getElementById("news-container");

  //Showing some Error in UI
  if (error) {
    newsContainer.innerHTML = `
		  <div class="container">
			  <p class="text-center">
					Something Went WRONG 🚫 Check Internet Connection. 📶
			  </p>
		  </div>`;
    alert("Something went wrong");
    return;
  }

  //Grabbing placeholders
  const categoryNav = document.getElementById("category-nav");
  const currentCategory = categoryNav.querySelector(
    `[data-category-id='${usedUrl.slice(-2)}']`
  );

  //Rendering number of news available to the corresponding category
  //for BONUS MARKS
  const numOfNews = document.getElementById("number-of-news");
  numOfNews.textContent = "";
  numOfNews.textContent = data.length
    ? `${data.length} news found in ${
        currentCategory ? currentCategory.textContent : ""
      }`
    : `No news found in ${currentCategory.textContent}`;

  //Sorting the News based on Number of Views
  //for BONUS MARKS
  const sortedData = data.sort((prev, next) => {
    if (prev.total_view > next.total_view) return -1;
  });

  newsContainer.innerHTML = "";
  sortedData.forEach((item) => {
    //Destructuring necessary info
    const {
      title,
      thumbnail_url,
      details,
      author,
      total_view,
      _id: news_id,
    } = item;
    const { img: author_img, name: author_name, published_date } = author;

    //Creating News
    const col = document.createElement("div");
    col.classList.add("col", "border", "rounded", "shadow", "my-3", "p-2");
    const template = `
            <div class="singleNews d-md-flex">
              <div
                class="thumbnail d-flex justify-content-center align-items-center"
              >
                <img
				class="mx-3"
                  src="${thumbnail_url}"
                />
              </div>
              <div class="content p-5">
                <article class="writings">
                  <h1>${title}</h1>
                  <p>
					${details.slice(0, 350) + " ..."}
                  </p>
                </article>

                <div
                  class="info d-md-flex justify-content-between align-items-center"
                >
                  <div class="author d-flex">
                    <div class="author-img">
                      <img
                        class="author-img"
                        src="${author_img}"
                        alt=""
                      />
                    </div>
                    <div class="author-info px-3">
                      <h5>${
                        author_name ? author_name : "No data available"
                      }</h5>
                      <p>${
                        published_date
                          ? moment(published_date).format("DD MMMM, YYYY")
                          : "No data available"
                      }</p>
                    </div>
                  </div>
                  <div class="views">
                    <h5>${
                      total_view || total_view === 0
                        ? '<i class="fa-regular fa-eye"></i>  ' +
                          total_view +
                          " views"
                        : "No data available"
                    } </h5>
                  </div>
                  <div class="modal-trigger" onclick="fetchNewsDetails('${news_id}')">
					  <a data-bs-toggle="modal" data-bs-target="#newsModal" href="#">
						  <i class="fa-solid fa-circle-arrow-right"></i>
					  </a>
				  </div>
                </div>
              </div>
            </div>
	  `;
    col.innerHTML = template;
    newsContainer.append(col);
  });
}

function renderNewsDetailsInModal({ error, data }) {
  //Grabbing Modal
  const newsModal = document.getElementById("news-modal");
  const modalTitle = document.querySelector(".modal-title");

  //Showing some Error in UI
  if (error) {
    newsModal.innerHTML = `
		  <div class="container">
			  <p class="text-center">
					Something Went WRONG 🚫 Check Internet Connection. 📶
			  </p>
		  </div>`;
    alert("Something went wrong");
    return;
  }

  const [_newsDetails] = [data];
  const newsDetails = _newsDetails[0];

  //Destructuring necessary info
  const { title, image_url, details, author, total_view } = newsDetails;
  const { img: author_img, name: author_name, published_date } = author;

  //Creating Modal
  modalTitle.textContent = "";
  modalTitle.textContent = title;

  const template = `
	  <div class="d-flex justify-content-center modal-img">
		<img class="news-modal-img img img-fluid" src="${image_url}" alt=""/>
	  </div>

                <div
                  class="info d-md-flex justify-content-between align-items-center mt-3"
                >
                  <div class="author d-flex">
                    <div class="author-img">
                      <img
                        class="author-img"
                        src="${author_img}"
                        alt=""
                      />
                    </div>
                    <div class="author-info px-3">
                      <h5>${
                        author_name ? author_name : "No data available"
                      }</h5>
                      <p>${
                        published_date
                          ? moment(published_date).format("DD MMMM, YYYY")
                          : "No data available"
                      }</p>
                    </div>
                  </div>
                  <div class="views">
                    <h5>${
                      total_view || total_view === 0
                        ? '<i class="fa-regular fa-eye"></i>  ' +
                          total_view +
                          " views"
                        : "No data available"
                    } </h5>
                  </div>
			  </div>



	  <div className="content">
		  <p>${details}</p>
	  </div>
	`;

  newsModal.innerHTML = "";
  newsModal.innerHTML = template;
}
