const request = require('request-promise');
const cheerio = require('cheerio');

// Function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const getNews = async (req, res) => {
    try {
        const response = await request('https://www.fanabc.com/archives/category/business');
        const $ = cheerio.load(response);

        const links = $('article a').map((index, element) => $(element).attr('href')).get();

        // Shuffle the array of links
        const shuffledLinks = shuffleArray(links);

        const maxRequests = 2; // Limit the number of parallel requests
        const articlesData = [];
        
        const requests = shuffledLinks.slice(0, maxRequests).map(async (link) => {
            const articleResponse = await request(link);
            const article$ = cheerio.load(articleResponse);

            const title = article$('.post-header-title .single-post-title .post-title').text().trim();
            const entryContent = article$('.entry-content.clearfix.single-post-content');
            const paragraphs = entryContent.find('p').map((index, element) => $(element).text()).get();
            const content = paragraphs.join('\n');
            const imgSrc = article$('div.single-featured img').attr('src');

            if (title !== "" && content !== "") {
                articlesData.push({
                    title: title,
                    content: content,
                    img: imgSrc
                });
            }
        });

        await Promise.all(requests);

        res.send(articlesData);
    } catch (error) {
        res.status(500).send("Error occurred while scraping the articles.");
    }
};

module.exports = { getNews };
