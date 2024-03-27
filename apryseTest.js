import pkg from '@pdftron/pdfnet-node';
const { PDFNet } = pkg;
async function main() {
  await PDFNet.initialize('demo:1711033027340:7f30187e03000000007b4a9c75d675f298861b360018608f240d7b1dc3');

  const pdfDoc = await PDFNet.PDFDoc.createFromFilePath('/Users/shaughnanderson/Desktop/programing/agency-scraper-1/1200019_2022-23_GPS-RAMIDI.pdf');
  await pdfDoc.initSecurityHandler();
  await pdfDoc.lock();

  const pageNumber = 2; 
  await extractTextFromPage(pdfDoc, pageNumber);

  await PDFNet.shutdown();
}

async function extractTextFromPage(pdfDoc, pageNumber) {
  let words = []
  const page = await pdfDoc.getPage(pageNumber);
  const textExtractor = await PDFNet.TextExtractor.create();
  await textExtractor.begin(page); 
  // const text = await textExtractor.getAsText();
  // console.log(pdfDoc , pageNumber)
  // console.log(text); 
  let line = await textExtractor.getFirstLine();
console.log(line)
  while( line.isValid){
  const firstWord = await line.getFirstWord();
  const firstBbox = await firstWord.getBBox();
  

  const firstWordText = await firstWord.getString();
  words.push({
    text: firstWordText,
    coordinates: firstBbox
})
let word =  await firstWord.getNextWord();
while(await word.isValid()){
  
  const Bbox = await word.getBBox();
  

  const wordText = await word.getString();
  words.push({
    text: wordText,
    coordinates: Bbox})
    word = await word.getNextWord();
}
line =  await line.getNextLine()
word = await line.getFirstWord();
}
console.log (words);
console.log (line);

}
  
main().catch((error) => {
  console.error('Error: ', error);
});
 