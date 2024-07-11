# Scraper

## Development Notes
### Setting up your environment
This project is not designed for deployment, however, it will set up a local database to be used in development. 

Clone the repo
``` terminal
git clone https://github.com/enBloc-org/Scraper.git
```

Intall all the dependencies with the command below.

```terminal
npm install
```

Ensure you have included the necessary environment variables
```terminal
BASE_URL=
COOKIE=
DELAY=
STATE_LIST=
```

## Usage

The code is designed to be run in five phases:
1. **Crawl** the source page to collect all data endpoints needed 
2. **Download** the base64 files available at each endpoint
3. **Convert** each file to PDF
4. **Validate** the PDF files to ensure they can be scraped 
5. **Scrape** the data from the validated PDF files


### Crawl
`crawler.js` will navigate through all the necessary endpoints to assemble a large json file which can be iterated through by our scraper.

This file needs to be run only once on setup. It will save the recovered json file onto a local database which will be the basis for the scraper to work from. If you need access to all endpoints and are now setting up your environment complete the installation and then enter this command to the terminal:

```terminal
npm run crawl
```

### Download
`downloader.js` will run through the assembled states file and perform checks to know how many files are available for download at each endpoint. Finally, it will download and save a base64 file

```terminal
npm run download
```

### Convert
`converter.js` will monitor the directory where all the base64 files have been downloaded to and convert each into a PDF file

```terminal
npm run convert
```

### Validate

Run ```node validateFiles.js```. This will check the files and send all files that are corrupted or in an unreadable format to corrupted_downloads.

### Scraper

The scraper runs in two parts in order to deal with the different layouts of the data on the PDFs. The first section of data is processed by the processGeneralData function. The second section of the data is processed by the processTableData function. These functions take the PDF path passed to them inside ```scraperCallback.js```. In this file, the scraper function is called for each file that has been downloaded and saved during the crawl, download, convert and validate processes. To trigger this process, you can run 

```terminal
npm run scrape
```

This will automatically create a school_data.sql database where the data from each PDF will be transferred to during the scraping process. After each PDF is scraped, you will see the word 'Scraped' appear in the terminal. You will also see ```Warning: fetchStandardFontData: failed to fetch file "LiberationSans-Bold.ttf" with "UnknownErrorException: The standard font "baseUrl" parameter must be specified, ensure that the "standardFontDataUrl" API parameter is provided.".``` This is a known issue and will not interfere with the scraping process.
