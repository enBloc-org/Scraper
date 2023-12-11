import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

function extractText(pdfUrl) {
	const loadingTask = getDocument(pdfUrl);
	loadingTask.promise.then(async (pdf) => {
		const countPromises = [];
				countPromises.push(pdf.getPage(2).then(async (page) => {
				const textContent = await page.getTextContent();
				return textContent.items.map(item => item.str);
			}));
			
		
		const texts = await Promise.all(countPromises);
		return texts.join()
	}).then((text) => {
		fs.writeFileSync('output.txt', text);
	}).catch((err) => {
		console.error(`Error: ${  err}`);
	});
	

}


extractText("/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf")