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
const showList = document.querySelector('show-list');

// serach button function 
searchBtn.addEventListener('click', async event => {


    const input = userInput.value;

    if (input) {
        try {
            const episodeData = await getEpisodeData(input);
            generateEpisode(episodeData);

            nextEpisodeBtn.addEventListener('click', () => {
                generateEpisode(episodeData)
            })

            showSection.style.display = "block";
            header.style.display = 'none';
        }
        catch (error) {
            console.log(error);
            displayError();
        }
    }
    else {
        displayError();
    }
});


// async function to fetch api information from TvMazw
async function getEpisodeData(input) {
    
    const url = `https://api.tvmaze.com/singlesearch/shows?q=${input}&embed=episodes`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Could not fetch show data')
    }
    return await response.json();
}

// function that generates random episosde and show img 
function generateEpisode(data) {
    // gets objects 
    const { image: { original }, 
        _embedded: { episodes } } = data;
    // sets show img source code
    showImg.src = `${original}`;

    //   Generate a random index
        const randomIndex = Math.floor(Math.random() * episodes.length);

    //   Select the random episode
      const randomEpisode = episodes[randomIndex];
    // sets text contents of episode information 
    title.textContent = randomEpisode.name;
    seasonNum.textContent = randomEpisode.season ;
    episodeNum.textContent = randomEpisode.number;
    //removes paragraph anchor tags
    let cleanedText = randomEpisode.summary.replace(/<\/?p>/g, '');
    // appends episode summary to page and centers text 
    para.textContent = cleanedText;
    para.style.textAlign = "center";
    
    
}

// back button function
function backButton(){
    showSection.style.display = 'none';
    header.style.display = 'flex';
}
// display error function 
function displayError() {
    return alert('Please Enter a Show Name')
}