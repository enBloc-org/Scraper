# agency-scraper

## Development Notes
### Setting up your environment
This project is not designed for deployment, however, it will set up a local database to be used in development. 

Intall all the dependencies with the command below.

```terminal
npm install
```

### Running the crawler file
`crawler.js` will navigate through all the necessary endpoints to assemble a large json file which can be iterated through by our scraper.

This file needs to be run only once on setup. It will save the recovered json file onto a local database which will be the basis for the scraper to work from. If you need access to all endpoints and are now setting up your environment complete the installation and then enter this command to the terminal:

```terminal
node crawler.js
```