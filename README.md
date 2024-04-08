# Your one-stop shop for all UCSD Course Enrollment Needs!

This web app, built with a Python/Flask backend and a React.js frontend allows you to 
plan out your schedule of classes every quarter. Simply enter your desired classes and 
this app will do all the work of finding a schedule that **just works™**.

You can enter your preferences about taking early morning classes or evening classes, and 
we'll take it into account. Have any times you're unavailable due to work or other reasons? You can input that too!

Furthermore, select any professors to avoid (*yikes*), get easy access to their CAPE data, and you'll also be shown how long it takes to walk between your consecutive classes, so you can avoid having to walk from Podemos to Warren Lecture Hall in 10 minutes.

This web app was built for the **UCSD DiamondHacks 2024**, and won the **Honorable Mention Award**!

[View the Demo Video here](https://www.youtube.com/watch?v=dDneyMvmDPc)

## Inspiration and What it Does

Any student at UCSD would relate to the quarterly ritual of planning your classes on WebReg. With its clunky UI, its unintuitive interface, and its limited functions, it's difficult to plan your classes effectively. To top it off, it stops working at night for *"processing"* (c'mon, it's 2024). 

We think that how you choose your classes can make or break your whole quarter. When you have 4, 5, or even 6 (for the gifted ones among us) classes to take, it's impossible to plan every combination of class timings and figure out which works for you the best. Not a morning person? Live off campus and want to get home early? We got you! We'll take into account all your preferences, and help you avoid those 8ams! 

We'll even avoid scheduling classes at any time of the week you're unavailable, if you have work or you're looking to attend schedued meetings. And we'll show you the time it takes to walk between your consecutive classes, so you can make sure they're humanly possible! How cool is that?

Everyone has experienced bad professors, so we'll display previous CAPE data on your schedule too! If you're trying to avoid any professors, or take a specific professor, simply select them, and we'll take care of the rest.

**We're here to make sure you plan a class schedule that aligns with YOUR preferences. What more could you need?**

## Challenges

Most of our time was spent on attempting to authenticate into the WebReg API, coding an agent to request and scrape course data from the Schedule of Classes HTML page, and reverse-engineering the maps.ucsd.edu page to get data on class locations and walking routes between them. Furthermore, we had to eliminate inefficiencies and determine the approach with the lowest time complexity, in order to make the app viable.

### Pre-Setup: Environment Variables!

You'll find in ``` app/api ``` a file ```constants.py``` with a empty API key. This is where you need your api key for the UCSD maps API! 

Head on over to [UCSD's map website](https://maps.ucsd.edu/map/default.htm) and open up the devtools. Pretty much any action you do on the website sidebar will make a request to their APIs where you'll see a ```key``` in the Query String payload. Copy that and you have your API key to set in ```constants.py```. Don't forget to add this file now to your .gitignore!

## Setup

1. Install [Python 3.10+](https://www.python.org/downloads/) and [Node.js](https://nodejs.org/en/download).
2. `cd` into the `app/` subdirectory
3. Run the `npm install` command to install all the npm dependencies
4. `cd` into the `api/` subdirectory
5. Run `pip install -r requirements.txt`

## Run the server

1. Open a Terminal window
2. `cd` into the `app/api` subdirectory
3. Run the Python Flask server by running `flask run`
4. Open another Terminal window. Don't close this one!
5. `cd` into the `app/` subdirectory
6. Run the React.JS server by running `yarn start`
7. This should open the browser with the app running by default. Alternatively, you can manually open `http://localhost:3000/` in any browser window. 
