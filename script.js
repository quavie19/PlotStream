const userInput = document.querySelector('input');
const header = document.getElementById('header');
const searchBtn = document.getElementById('search-btn');
const showSection = document.getElementById('show-header');
const backBtn = document.getElementById('back-btn');
const showImg = document.querySelector('img');
const title = document.getElementById('title');
const seasonNum = document.getElementById('season-number');
const episodeNum = document.getElementById('episode-number');
const nextEpisodeBtn = document.getElementById('next-episode-btn');
const para = document.querySelector('.para');
const showList = document.getElementById('show-list');

// Search button function 
searchBtn.addEventListener('click', async event => {
    const input = userInput.value.trim();

    if (input) {
        try {
            const episodeData = await getEpisodeData(input);
            generateEpisode(episodeData);

            nextEpisodeBtn.addEventListener('click', () => {
                generateEpisode(episodeData);
            });

            showSection.style.display = "block";
            header.style.display = 'none';
        } catch (error) {
            console.log(error);
            displayError();
        }
    } else {
        displayError();
    }
});

// Input event listener for search filter
userInput.addEventListener('input', async event => {
    const input = userInput.value.trim();

    if (input) {
        try {
            const shows = await fetchShows();
            filterShows(shows);
        } catch (error) {
            console.log(error);
            // Handle error if necessary
        }
    } else {
        // Optionally clear the show list or handle empty input
        showList.innerHTML = '';
    }
});

// Async function to fetch all shows from TVmaze
async function fetchShows() {
    const url = 'https://api.tvmaze.com/shows';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Async function to fetch episode data for a specific show
async function getEpisodeData(input) {
    const url = `https://api.tvmaze.com/singlesearch/shows?q=${input}&embed=episodes`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Could not fetch show data');
    }
    return await response.json();
}

// Function that generates a random episode and shows the image
function generateEpisode(data) {
    const { image: { original }, _embedded: { episodes } } = data;
    showImg.src = original;

    const randomIndex = Math.floor(Math.random() * episodes.length);
    const randomEpisode = episodes[randomIndex];

    title.textContent = randomEpisode.name;
    seasonNum.textContent = `Season: ${randomEpisode.season}`;
    episodeNum.textContent = `Episode: ${randomEpisode.number}`;

    const cleanedText = randomEpisode.summary.replace(/<\/?p>/g, '');
    para.textContent = cleanedText;
    para.style.textAlign = "center";
}

// Display the initial list of shows or filtered results
function displayShows(shows) {
    showList.innerHTML = ''; // Clear the current list

    // Limit to the first five results
    const limitedShows = shows.slice(0, 7);

    limitedShows.forEach(show => {
        const li = document.createElement('li');
        li.textContent = show.name;
        li.addEventListener('click', () => selectShow(show));
        showList.appendChild(li);
    });
}

// Filter shows based on user input
function filterShows(shows) {
    const query = userInput.value.toLowerCase().trim();
    const filteredShows = shows.filter(show => show.name.toLowerCase().includes(query));
    displayShows(filteredShows);
}

// Handle the show selection, add it to the input field, and remove the list
function selectShow(show) {
    userInput.value = show.name;
    userInput.focus(); // Optionally focus the input field

    // Clear the show list
    showList.innerHTML = '';
}

// Back button function
function backButton() {
    showSection.style.display = 'none';
    header.style.display = 'flex';
}

// Display error function
function displayError() {
    alert('Please Enter a Show Name');
}
