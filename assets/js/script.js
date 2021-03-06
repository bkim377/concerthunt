$(document).ready(function () {

  // GET THE TOP ARTISTS RESPONSE FROM LAST FM
  getTopArtists().then(function (response) {
    // ARRAY OF 12 TOP ARTISTS
    var topArtists = response.artists.artist;

    // CREATE THE SECTION TITLE
    var articleTitle = $(
      "<article class='grid-container' id='artist-search'><h2 class='main-title'><strong>Top Artists</strong></h2><div id='cards-group' class='grid-x grid-margin-x small-up-2 medium-up-3 large-up-4'></div></article>"
    );

    // APPEND THE TITLE TO THE MAIN TAG
    $("main").append(articleTitle);

    // LOOP TROUGH THE TOP ARTISTS ARRAY
    for (var i = 0; i < topArtists.length; i++) {
      let artistName = topArtists[i].name;
      let artistURL = topArtists[i].url;

      // GET THE ARTIST NAME,IMAGE AND URL
      getArtistImage(artistName).then(function (imageResp) {
        let obj = {
          image: imageResp.thumb_url,
          name: imageResp.name,
        };

        // CREATE THE CARD FOR EACH ARTIST
        var cardEl = createCardTopArtists(obj.name, obj.image);

        // APPEND THE ARTIST CARD TO THE DOM
        $("#cards-group").append(cardEl);
      });
    }
  });

  // FUNCTION TO CREATE THE HTML ARTIST CARD
  function createCardTopArtists(artist, image) {
    return `<div class="cell" onclick="showTopAristInfo('${artist}');"><img class="thumbnail" src="${image}"/><h5 class="artist-name">${artist}</h5></a></div>`;
  }

  // EVENT LISTENER ON THE SEARCH BUTTON
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();

    // EMPTY THE PAGE CONTENT
    $("#content").empty();

    // GET THE ARTIST NAME FROM INPUT FIELD
    let artist = $("#inputSearch").val();

    // GET THE ARTIST INFO RESPONSE FROM LAST FM
    artistInfoQueryLFM(artist).then(function (lastResponse) {
      // CREATE THE ARTIST INFO HTML ELEMENT
      let artistInfoElem = createArtistInfoLFMEl(lastResponse);

      // GET ARTIST IMAGE FROM BANDSINTOWN
      getArtistImage(artist).then(function (response) {
        let image = response.thumb_url;
        let name = response.name;
        // ADD THE SOURCE ATTRIBUTE TO THE IMAGE AND APPEND IT TO THE DOM
        $("#artist-650")
          .attr("src", image)
          .append(image);
      });

      // GET ALBUM IMAGES FROM LAST FM, ADD IMAGES TO AN ARRAY AND APPEND THEM TO THE DOM WITH THE SOURCE ATTRIBUTE
      getAlbumImagesLFM(artist).then(function (resp) {
        var images = [];
        for (var i = 0; i < 4; i++) {
          images.push(resp.topalbums.album[i].image[2][`#text`]);
          console.log(resp.topalbums.album[i].image[2][`#text`]);
          $("#album" + (i + 1))
            .attr("src", images[i])
            .append(images[i]);
          $("#album" + (i + 1)).wrap(
            $("<a>", {
              href: resp.topalbums.album[i].url
            })
          );
        }
      });

      // GET CONCERT INFORMATION FROM BANDSINTOWN
    concertQueryBIT(artist).then(function (concertResponseBIT) {

      if (concertResponseBIT.length == 0) {
        $(".concert-info").empty();
        $("#concerts").append(
          "Whoops! Looks like there are no upcoming concerts for " + artist
        );
      } else {
        $("#concerts").empty();
        $("#concerts").append("Concerts for " + artist);
        $("#facebook-link").attr("href", concertResponseBIT[0].artist.facebook_page_url);
        $("#bandsintown-link").attr("href", concertResponseBIT[0].artist.url);

        for (var i = 0; i < concertResponseBIT.length; i++) {

          let concertDate = moment(concertResponseBIT[i].datetime).format("dddd, MMMM Do, YYYY, h:mm a");
          let venueName = concertResponseBIT[i].venue.name;
          let venueCity = concertResponseBIT[i].venue.city;
          let venueCountry = concertResponseBIT[i].venue.country;
          let buyTickets = concertResponseBIT[i].offers[0].url;

          var concertInfoElem = $("<div class='media-object stack-for-small'><div class='media-object-section'><h5 id='date-time1'>"+ concertDate +"</h5><p id='venue'" + (i+1) + ">Venue: " + venueName +" - " + venueCity + ", " + venueCountry + "</p><a id='button"+(i+1)+"'class='button' href='"+ buyTickets +"' target='_blank'>Buy Tickets</a></div></div><hr>"); 
          
          $(".concert-info").append(concertInfoElem);
        }
      }
    }); // END OF CONCERT QUERY BIT
      
      $("#content").append(artistInfoElem);
      
    });
  });
});


////////////////////////////////////////////////////////////////////////////////////////

const bandsAPIKey = "7a94704114b40126fda0059aab05bb1c";
const lastFmAPIKey = "f73c832fa45f573c5aa8ef6885d8fab3";


function showTopAristInfo(artist) {

  $("#content").empty();

  // GET THE ARTIST INFO RESPONSE FROM LAST FM
  artistInfoQueryLFM(artist).then(function (lastResponse) {
    // CREATE THE ARTIST INFO HTML ELEMENT
    let artistInfoElem = createArtistInfoLFMEl(lastResponse);
    // console.log(lastResponse);
    // GET ARTIST IMAGE FROM BANDSINTOWN
    getArtistImage(artist).then(function (response) {
      let image = response.thumb_url;
      let name = response.name;
      // ADD THE SOURCE ATTRIBUTE TO THE IMAGE AND APPEND IT TO THE DOM
      $("#artist-650")
        .attr("src", image)
        .append(image);
    });

    // GET ALBUM IMAGES FROM LAST FM, ADD IMAGES TO AN ARRAY AND APPEND THEM TO THE DOM WITH THE SOURCE ATTRIBUTE
    getAlbumImagesLFM(artist).then(function (resp) {
      var images = [];
      for (var i = 0; i < 4; i++) {
        images.push(resp.topalbums.album[i].image[2][`#text`]);
        
        $("#album" + (i + 1))
          .attr("src", images[i])
          .append(images[i]);
        $("#album" + (i + 1)).wrap(
          $("<a>", {
            href: resp.topalbums.album[i].url
          })
        );
      }
    });

    // GET CONCERT INFORMATION FROM BANDSINTOWN
    concertQueryBIT(artist).then(function (concertResponseBIT) {

      if (concertResponseBIT.length == 0) {
        $(".concert-info").empty();
        $("#concerts").append(
          "Whoops! Looks like there are no upcoming concerts for " + artist
        );
      } else {
        $("#concerts").empty();
        $("#concerts").append("Concerts for " + artist);
        $("#facebook-link").attr("href", concertResponseBIT[0].artist.facebook_page_url);
        $("#bandsintown-link").attr("href", concertResponseBIT[0].artist.url);

        for (var i = 0; i < concertResponseBIT.length; i++) {

          let concertDate = moment(concertResponseBIT[i].datetime).format("dddd, MMMM Do, YYYY, h:mm a");
          let venueName = concertResponseBIT[i].venue.name;
          let venueCity = concertResponseBIT[i].venue.city;
          let venueCountry = concertResponseBIT[i].venue.country;
          let buyTickets = concertResponseBIT[i].offers[0].url;
          console.log(buyTickets);

          var concertInfoElem = $("<div class='media-object stack-for-small'><div class='media-object-section'><h5 id='date-time1'>"+ concertDate +"</h5><p id='venue'" + (i+1) + ">Venue: " + venueName +" - " + venueCity + ", " + venueCountry + "</p><a id='button"+(i+1)+"'class='button' href='"+ buyTickets +"' target='_blank'>Buy Tickets</a></div></div><hr>"); 
          
          $(".concert-info").append(concertInfoElem);
        }
      }
    }); // END OF CONCERT QUERY BIT

    $("#content").append(artistInfoElem);
    
  });
}; // END OF FUNCTION SHOW TOP ARTIST INFO



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// FUNCTION TO CREATE THE HTML ARTIST INFO PAGE
function createArtistInfoLFMEl(obj) {
  return ` <article class="grid-container" id="artist-details">
  <div class="grid-x grid-margin-x">
    <div class="medium-6 cell" id="artist-images">
      <img id="artist-650" class="thumbnail" src="" alt="${obj.artist.name}"/>
      <div class="grid-x grid-padding-x small-up-4">
        <div class="cell">
          <img id="album1" alt="artist album cover 1"/>
        </div>
        <div class="cell">
          <img id="album2" alt="artist album cover 2"/>
        </div>
        <div class="cell">
          <img id="album3" alt="artist album cover 3" />
        </div>
        <div class="cell">
          <img id="album4" alt="artist album cover 4" />
        </div>
      </div>
    </div>

    <div class="medium-6 large-5 cell large-offset-1">
      <h2>${obj.artist.name}</h2>
      <p id="artist-genre">Genre: ${obj.artist.tags.tag[0].name}</p>  
      <p id="artist-info">${obj.artist.bio.summary}</p>

      <a href="./index.html" class="button large expanded">ConcertHunt</a>

      <div class="small secondary expanded button-group">
      <a class="button" id="facebook-link" target="_blank">Facebook</a>
      <a class="button" id="bandsintown-link" target="_blank">BandsInTown</a>
      <a class="button" id="lastfm-link" href="${obj.artist.url}" target="_blank">Last.FM</a>
      </div>
    </div>
  </div>

  <div class="tabs-section">
    <hr />
      <div
        class="tabs-panel is-active"
        id="artist-concerts"
        role="concert-panel"
        aria-labelledby="panel2-label"
        aria-hidden="true"
      >
        <h2 id="concerts"></h2>

        <hr>

        <div class="concert-info">

        </div>

      </div>
    </div>
  </div>

  <hr />
</article>`;
}

// FUNCTION TO QUERY ARTIST INFO FROM LAST FM
function artistInfoQueryLFM(artist) {
  var queryLFM =
    "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +
    artist +
    "&api_key=" +
    lastFmAPIKey +
    "&format=json";

  return $.ajax({
    url: queryLFM,
    method: "GET"
  });
}

// FUNCTION TO QUERY TOP ARTISTS FROM LAST FM
function getTopArtists() {
  var queryTopLFM =
    "https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=12&api_key=" +
    lastFmAPIKey +
    "&format=json";

  return $.ajax({
    url: queryTopLFM,
    method: "GET"
  });
}

// FUNCTION TO QUERY ARTIST IMAGES FROM BANDSINTOWN
function getArtistImage(artist) {
  var queryImagesBIT =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "?app_id=" +
    bandsAPIKey;

  return $.ajax({
    url: queryImagesBIT,
    method: "GET"
  });
}

// FUNCTION TO QUERY ALBUM INFO FROM LAST FM
function getAlbumImagesLFM(artist) {
  var queryAlbumsLFM =
    "https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" +
    artist +
    "&api_key=" +
    lastFmAPIKey +
    "&format=json";

  return $.ajax({
    url: queryAlbumsLFM,
    method: "GET"
  });
}

// FUNCTION TO QUERY CONCERT INFO FROM BANDSINTOWN
function concertQueryBIT(artist) {
  var queryConcertBIT =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=" +
    bandsAPIKey;

  return $.ajax({
    url: queryConcertBIT,
    method: "GET"
  }).then(function (concertResponse) {
    return concertResponse;
  });
}