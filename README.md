# agency-scraper

## Development Notes
### Setting up your environment
This project is not designed for deployment, however, it will set up a local database to be used in development. 

Intall all the dependencies with the command below.

```terminal
npm install
```

## Usage
The code is designed to be run in five phases:
- **Crawl** the source page to collect all data endpoints needed 
- **Download** the base64 files available at each endpoint
- **Convert** each file to PDF
- **validateFiles**
- **Scrape** the data from those files


### Crawling
`crawler.js` will navigate through all the necessary endpoints to assemble a large json file which can be iterated through by our scraper.

This file needs to be run only once on setup. It will save the recovered json file onto a local database which will be the basis for the scraper to work from. If you need access to all endpoints and are now setting up your environment complete the installation and then enter this command to the terminal:

```terminal
npm run crawl
```

### Downloading
`downloader.js` will run through the assembled states file and perform checks to know how many files are available for download at each endpoint. Finally, it will download and save a base64 file

```terminal
npm run download
```

### Converting
`converter.js` will monitor the directory where all the base64 files have been downloaded to and convert each into a PDF file

```terminal
npm run convert
```

**validateFiles**

Run ```node validateFiles.js``. This will check the files and send all files that don't meet the requirements to corrupted_downloads.

### Scraper
*more info very soon*
