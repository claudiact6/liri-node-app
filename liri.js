require("dotenv").config();
var request = require("request");
var fs = require("fs");
var keys = require("./keys");
var Spotify = require('node-spotify-api')
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
console.log(command);
var searchTerm = "";
for (i = 3; i < process.argv.length; i++) {
    searchTerm += process.argv[i] + "%20";
}

//What to do if searchTerm is blank for commands that require a searchTerm
if(command === "movie-this" && searchTerm === "") {
        searchTerm = "Mr. Nobody";
} else if(command === "spotify-this-song" && searchTerm === "") {
        searchTerm = "I Saw the Sign";
}

console.log(searchTerm);
takeCommand(command, searchTerm);

function takeCommand(command, searchTerm) {
    switch(command) {
        case "concert-this":
            //Search BandsInTown API for artist to provide venue name, location, and date of all upcoming concerts.
            var queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp"
            request(queryUrl, function (error, response, body) {
                // If the request is successful
                if (!error && response.statusCode === 200) {
                    console.log(JSON.parse(body));
                }
            });
            break;
        case "spotify-this-song":
            //Search the Spotify API to show song name, artist(s), the album, and a link to the song from Spotify
            break;
        case "movie-this":            
            //Search the OMDB API to show movie title, release year, IMDB rating, Rotten Tomatoes rating, country where the movie was produced, language of the movie, plot summary, and actors.
            var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy";
            console.log(queryUrl);
            request(queryUrl, function (error, response, body) {
                // If the request is successful
                if (!error && response.statusCode === 200) {
                    var movie = JSON.parse(body);
                    console.log("---" + movie.Title + "---");
                    console.log("Released in", movie.Year);
                    console.log(movie.Ratings[0].Source + " rating: " + movie.Ratings[0].Value);
                    console.log(movie.Ratings[1].Source + " rating: " + movie.Ratings[1].Value);
                    console.log("Produced in", movie.Country);
                    console.log("Language:", movie.Language);
                    console.log("Leading actors:", movie.Actors);
                    console.log("Summary:",movie.Plot);
                }
            });
            break;
        case "do-what-it-says":
            //Do what "random.txt" says.
            fs.readFile("random.txt", "utf8", function (error, data) {
                console.log(data);
                var splitFile = data.split(",");
                console.log(splitFile);
                takeCommand(splitFile[0], splitFile[1]);
            });
            break;
        default:
            console.log("Arguments not understood");
    }
};

//Log all the search results to log.txt
function logData() {
    fs.writeFile("log.txt", data, function(err) {
        if(err) {
            console.log("Oops, there was an error");
        } else {
            console.log("Data was logged to file!")
        }
    });
}