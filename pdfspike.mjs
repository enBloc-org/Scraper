
// eslint-disable-next-line import/no-extraneous-dependencies
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs"
const gen = {
    "Pre-Pr": {
      B: {
        xmin: 54,
        xmax: 61,
        y: 757.25
      },
      G: {
        xmin: 70,
        xmax: 78,
        y: 757.25
      }
    },
    "1": {
      B: {
        xmin: 87,
        xmax: 95,
        y: 757.25
      },
      G: {
        xmin: 105,
        xmax: 113,
        y: 757.25
      }
    },
    "2": {
      B: {
        xmin: 123,
        xmax: 130,
        y: 757.25
      },
      G: {
        xmin: 140,
        xmax: 148,
        y: 757.25
      }
    },
    "3": {
      B: {
        xmin: 158,
        xmax: 166,
        y: 757.25
      },
      G: {
        xmin: 176,
        xmax: 184,
        y: 757.25
      }
    },
    "4": {
      B: {
        xmin: 194,
        xmax: 201,
        y: 757.25
      },
      G: {
        xmin: 212,
        xmax: 219,
        y: 757.25
      }
    },
    "5": {
      B: {
        xmin: 230,
        xmax: 236,
        y: 757.25
      },
      G: {
        xmin: 247,
        xmax: 254,
        y: 757.25
      }
    },
    "6": {
      B: {
        xmin: 266,
        xmax: 272,
        y: 757.25
      },
      G: {
        xmin: 283,
        xmax: 290,
        y: 757.25
      }
    },
    "7": {
      B: {
        xmin: 301,
        xmax: 307,
        y: 757.25
      },
      G: {
        xmin: 318,
        xmax: 325,
        y: 757.25
      }
    },
    "8": {
      B: {
        xmin: 337,
        xmax: 343,
        y: 757.25
      },
      G: {
        xmin: 354,
        xmax: 361,
        y: 757.25
      }
    },
    "9": {
      B: {
        xmin: 372,
        xmax: 378,
        y: 757.25
      },
      G: {
        xmin: 389,
        xmax: 397,
        y: 757.25
      }
    },
    "10": {
      B: {
        xmin: 408,
        xmax: 414,
        y: 757.25
      },
      G: {
        xmin: 425,
        xmax: 432,
        y: 757.25
      }
    },
    "11": {
      B: {
        xmin: 443,
        xmax: 449,
        y: 757.25
      },
      G: {
        xmin: 460,
        xmax: 468,
        y: 757.25
      }
    },
    "12": {
      B: {
        xmin: 478,
        xmax: 484,
        y: 757.25
      },
      G: {
        xmin: 495,
        xmax: 502,
        y: 757.25
      }
    },
    "Total": {
      B: {
        xmin: 514,
        xmax: 520,
        y: 757.25
      },
      G: {
        xmin: 534,
        xmax: 541,
        y: 757.25
      },
      All: {
        xmin: 553,
        xmax: 560,
        y: 757.25
      }
    }
  };

function extractText(pdfUrl) {
  const loadingTask = getDocument(pdfUrl)
  loadingTask.promise
    .then(async pdf => {
      const countPromises = []
      countPromises.push(
        pdf.getPage(2).then(async page => {
          const textContent = await page.getTextContent()
          return textContent.items.map(item => ({
            text: item.str,
            x: item.transform[4], // x-coord
            y: item.transform[5], // y-coord
          }))
        }),
      )

      const texts = await Promise.all(countPromises)
      return texts.flat()
    })
    .then(items => {
      console.log(items)
	  for (const grade in gen) {
        if (gen.hasOwnProperty(grade)) {
          const gradeData = gen[grade];
          for (const col in gradeData) {
            if (gradeData.hasOwnProperty(col)) {
              const { xmin, xmax, y } = gradeData[col];
              items.forEach(item => {
                if (item.x >= xmin && item.x <= xmax && Math.abs(item.y - y) <= 1) {
                  console.log(`${grade}_${col}: ${item.text}`);
                }
              });
            }
          }
        }
      }
    })
	.catch(err => {
		console.error(`Error: ${err}`)
	  })
}



extractText("/Users/eazzopardi/code/agency-scraper/sample report card (1).pdf")
