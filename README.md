# Your one-stop shop for all UCSD Course Enrollment Needs!

This web app, built with a Python/Flask backend and a React.js frontend allows you to 
plan out your schedule of classes each quarter. Simply input your desired classes and 
this app will do all the work of finding a schedule that **just works™**.

You can enter your preferences about taking early morning classes or evening classes, and 
we'll take it into account. Have any times you're unavailable due to work or other reasons? You can input that too!

Furthermore, select any professors to avoid (*yikes*), get easy access to their CAPE data, and you'll also be shown how long it takes to walk between your consecutive classes, so you can avoid having to walk from Podemos to Warren Lecture Hall in 10 minutes.

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