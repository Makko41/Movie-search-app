
<script>
  let debounceTimer;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let currentPage = 1;
  let currentMovie = "";
  let typingTimer;
  
document.getElementById("movieInput").addEventListener("input", function(){

clearTimeout(typingTimer);

typingTimer = setTimeout(function(){

searchMovie();

}, 500);

});

  async function searchMovie(){

currentMovie = document.getElementById("movieInput").value.trim();
currentPage = 1;

if(currentMovie===""){
alert("Enter movie name");
return;
}

fetchMovies();
}

async function fetchMovies(){

let container = document.getElementById("movieContainer");

showSkeleton();

let apiKey="7b1c18b";

let url=`https://www.omdbapi.com/?apikey=${apiKey}&s=${currentMovie}&page=${currentPage}`;

container.innerHTML = "";

for(let i=0;i<8;i++){

let skeleton = document.createElement("div");
skeleton.className = "skeleton";

container.appendChild(skeleton);

}

let response = await fetch(url);

let data = await response.json();

if(data.Response === "False"){
container.innerHTML = "No movies found";
return;
}

renderMovies(data.Search);

document.getElementById("pageNumber").innerText = "Page " + currentPage;

}

function renderMovies(movies){

let container = document.getElementById("movieContainer");
container.innerHTML = "";

for(let i = 0; i < movies.length; i++){

let card = createMovieCard(movies[i]);

card.innerHTML = `
<img src="${movies[i].Poster}">
<h3>${movies[i].Title}</h3>
<p>${movies[i].Year}</p>
<button onclick="addFavorite('${movies[i].imdbID}','${movies[i].Title}','${movies[i].Poster}')">❤️</button>
`;

container.appendChild(card);

}
}

function nextPage(){

currentPage++;

fetchMovies();

}

function prevPage(){

if(currentPage > 1){

currentPage--;

fetchMovies();

}

}
async function getMovieDetails(id){

let apiKey = "7b1c18b";

let url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`;

let response = await fetch(url);

let data = await response.json();

let modalBody = document.getElementById("modalBody");

modalBody.innerHTML = `
<h2>${data.Title}</h2>
<img src="${data.Poster}" width="200">
<p><b>Year:</b> ${data.Year}</p>
<p><b>Rating:</b> ${data.imdbRating}</p>
<p><b>Actors:</b> ${data.Actors}</p>
<p><b>Plot:</b> ${data.Plot}</p>
`;

document.getElementById("movieModal").style.display = "block";

}
function closeModal(){

document.getElementById("movieModal").style.display = "none";

}

document.getElementById("movieInput").addEventListener("keydown", function(event){

if(event.key === "Enter"){
searchMovie();
}

});
function showSkeleton(){

let container = document.getElementById("movieContainer");

container.innerHTML = "";

for(let i=0;i<8;i++){

let card = document.createElement("div");
card.className = "skeleton";

container.appendChild(card);

}

}
function createMovieCard(movie){
  
  let favBtn = document.createElement("button");
favBtn.innerText = "❤️ Favorite";

favBtn.onclick = function(e){

e.stopPropagation(); // prevents opening modal

addToFavorites(movie);
card.appendChild(favBtn);
};

let card = document.createElement("div");
card.className = "movieCard";

card.onclick = function(){
getMovieDetails(movie.imdbID);
};

let img = document.createElement("img");
img.src = movie.Poster;

let title = document.createElement("h3");
title.innerText = movie.Title;

let year = document.createElement("p");
year.innerText = movie.Year;

card.appendChild(img);
card.appendChild(title);
card.appendChild(year);

return card;
}

function showFavorites(){

let container = document.getElementById("movieContainer");

container.innerHTML = "";

if(favorites.length === 0){
container.innerHTML = "No favorite movies yet";
return;
}

for(let i=0;i<favorites.length;i++){

let card = document.createElement("div");
card.className = "movieCard";

card.innerHTML = `
<img src="${favorites[i].poster}">
<h3>${favorites[i].title}</h3>
<button onclick="removeFavorite(${i})">Remove</button>
`;

container.appendChild(card);

}

}


function showSearch(){

document.getElementById("movieContainer").innerHTML = "";

}

function saveFavorites(){
localStorage.setItem("favorites", JSON.stringify(favorites));
}


function addFavorite(id,title,poster){

for(let i = 0; i < favorites.length; i++){

 if(favorites[i].id === id){
  alert("Movie already in favorites");
  return;
 }

}

favorites.push({
 id:id,
 title:title,
 poster:poster
});

saveFavorites();

alert("Added to favorites");

}

function removeFavorite(index){

favorites.splice(index,1);

saveFavorites();

showFavorites();

}

document.getElementById("movieInput").addEventListener("input", function(){

clearTimeout(debounceTimer);

debounceTimer = setTimeout(function(){

searchMovie();

},500);

});
</script>