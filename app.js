

require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');

hbs.registerPartials(__dirname + '/views/partials');
// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.get('/artist-search', (req, res) => {
    spotifyApi
        .searchArtists(req.query.q)
        .then(data => {
            //console.log('The received data from the API: ', data.body.artists.items[0]);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render('artist-search-results', { artists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/album/:artistId', (req, res) => {

    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            // console.log('Artist albums', data.body.items);

            res.render('albums', { albumartist: data.body.items })
        }, function (err) {
            console.error(err);
        });
})

app.get('/tracks/:albumId', (req, res) => {

    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log(data.body);
            res.render('tracks', { tracklists: data.body.items })

        }, function (err) {
            console.log('Something went wrong!', err);
        });
})

// Our routes go here:
app.get('/', (req, res) => {
    res.render('layout')
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
