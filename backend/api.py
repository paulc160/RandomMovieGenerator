import random
from flask import Flask, request, jsonify
from flask_cors import CORS,cross_origin
import requests
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/randomMovie",methods=['POST'])
def getRandomMovie():
    genreIds = []
    genreData = request.json
    genreData = genreData['genreData']
    for i in genreData:
        genreIds.append(i['value'])
    base_url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres="
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YjE4OWFmODBjYWE1YzgwZTUwNjY1M2ZkZGNlYWI5YyIsIm5iZiI6MTcyMjE5MTk1My4wMjMyMjcsInN1YiI6IjY0N2VmZDMxMGUyOWEyMmJlMDhlOTA2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1_kbTqBOev07jVjCfNCJeT7HjHdanbCyaMnWmTHq1-U"
    }
    for j in genreIds:
        base_url = base_url + str(j) + ","
    response = requests.get(base_url, headers=headers)
    pageData = response.json()
    numPages = pageData['total_pages']
    if(numPages > 5):
        if(numPages > 500):
            randomNumberPage = random.randint(1, 500)
        else:
            randomNumberPage = random.randint(1, numPages)
        new_url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={randomNumberPage}&sort_by=popularity.desc&with_genres="
        for j in genreIds:
            new_url = new_url + str(j) + ","
        response = requests.get(new_url, headers=headers)
        movieData = response.json()
        results = movieData['results']
        lengthResults = len(results)
        randomNumberMovie = random.randint(1, lengthResults - 1)
        imdbID = getIMDBID(results[randomNumberMovie]['id'])
        movieData = getOMDBData(imdbID)
        rottenTomatoesRating = getRottenTomatoesRating(movieData)
        data = returnData(results,randomNumberMovie,movieData,rottenTomatoesRating)
        return jsonify(data)
    elif(numPages <= 5 and numPages > 1):
        randomNumberPage = random.randint(1, numPages)
        new_url = f"https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page={randomNumberPage}&sort_by=popularity.desc&with_genres="
        for j in genreIds:
            new_url = new_url + str(j) + ","
        response = requests.get(new_url, headers=headers)
        movieData = response.json()
        results = movieData['results']
        lengthResults = len(results)
        randomNumberMovie = random.randint(1, lengthResults)
        imdbID = getIMDBID(results[randomNumberMovie]['id'])
        movieData = getOMDBData(imdbID)
        rottenTomatoesRating = getRottenTomatoesRating(movieData)
        data = returnData(results,randomNumberMovie,movieData,rottenTomatoesRating)
        return jsonify(data)
    elif(numPages == 1):
        if(data['total_results'] == 0):
            return("No Movies found")
        else:
            response = requests.get(base_url, headers=headers)
            movieData = response.json()
            results = movieData['results']
            lengthResults = len(results)
            randomNumberMovie = random.randint(1, lengthResults)
            imdbID = getIMDBID(results[randomNumberMovie]['id'])
            movieData = getOMDBData(imdbID)
            rottenTomatoesRating = getRottenTomatoesRating(movieData)
            data = returnData(results,randomNumberMovie,movieData,rottenTomatoesRating)
            return jsonify(data)
    else:
        return "No movies found"
    
    
def getIMDBID(movieID):
    base_url = f"https://api.themoviedb.org/3/movie/{movieID}?language=en-US"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YjE4OWFmODBjYWE1YzgwZTUwNjY1M2ZkZGNlYWI5YyIsIm5iZiI6MTcyMjE5MTk1My4wMjMyMjcsInN1YiI6IjY0N2VmZDMxMGUyOWEyMmJlMDhlOTA2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1_kbTqBOev07jVjCfNCJeT7HjHdanbCyaMnWmTHq1-U"
    }
    response = requests.get(base_url, headers=headers)
    movieDetails = response.json()
    imdbID = movieDetails['imdb_id']
    return imdbID

def getOMDBData(imdbID):
    base_url = f"https://www.omdbapi.com/?i={imdbID}&apikey=68a542e7"
    response = requests.get(base_url)
    omdbData = response.json()
    return omdbData

def getRottenTomatoesRating(movieDetails):
    ratings = movieDetails["Ratings"]
    for rating in ratings:
        if rating.get("Source") == "Rotten Tomatoes":
            return rating.get("Value")
    return "?"

def returnData(results,randomNumberMovie,movieData,rottenTomatoesRating):
    data = {
            "title" : results[randomNumberMovie]['original_title'],
            "description" : results[randomNumberMovie]['overview'],
            "poster_path" : results[randomNumberMovie]['poster_path'],
            "release_date" : results[randomNumberMovie]['release_date'],
            "rating" : movieData["Rated"],
            "runtime" : movieData["Runtime"],
            "genres" : movieData["Genre"],
            "director" : movieData["Director"],
            "actors" : movieData["Actors"],
            "rotten_tomatoes_rating" : rottenTomatoesRating,
            "imdb_score" : movieData["imdbRating"],
            "box_office": movieData["BoxOffice"]
    }
    return data

if __name__ == "__main__":
    app.run(debug=True,port=8080)