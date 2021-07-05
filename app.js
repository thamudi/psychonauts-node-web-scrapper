'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util')

const writeFileAsync = promisify(fs.writeFile);

/*
===========================================================================
- Some helpful links:

https://pptr.dev/#?product=Puppeteer&version=v9.1.1&show=api-class-page
https://pptr.dev/#?product=Puppeteer&version=v9.1.1&show=api-pageselector
https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll

===========================================================================
*/

// const dataSourceStatus = async (dataSourceValue, page) => {
//    const status = await page.$$eval('.pi-item.pi-data.pi-item-spacing', elements => {
//       return elements.filter(data => {
//          return data.getAttribute('data-source') === dataSourceValue;
//       }).length > 0 ? true : false;
//    });

//    return status;
// }

const scrapeData = async (url) => {
   const browser = await puppeteer.launch({ headless: true });
   const page = await browser.newPage();

   await page.goto(url);

   if ((await page.$$('li.category-page__member a'))) {
      const queriedPageMembers = await page.$$eval('li.category-page__member',
         links => links.map(link => {
            const a = link.querySelector('li.category-page__member > a');
            return {
               name: a.innerText,
               link: a.href

            }
         }).filter(obj => !(obj.name.match(/(category|list)/gi)))
      );
      ``

      console.log(`total`, queriedPageMembers.length);

      const data = [];
      let count = 0;
      for (const { name, link } of queriedPageMembers) {
         await Promise.all([
            page.waitForNavigation(),
            page.goto(link),
         ]);

         try {

            // const genderDataSource = await dataSourceStatus('gender', page);

            // const psiPowersDataSource = await dataSourceStatus('psi_powers', page);

            const genderDataSource = await page.$$eval('.pi-item.pi-data.pi-item-spacing', elements => {
               return elements.filter(data => {
                  return data.getAttribute('data-source') === 'gender';
               }).length > 0 ? true : false;
            });

            const psiPowersDataSource = await page.$$eval('.pi-item.pi-data.pi-item-spacing', elements => {
               return elements.filter(data => {
                  return data.getAttribute('data-source') === 'psi_powers';
               }).length > 0 ? true : false;
            });


            if (genderDataSource && psiPowersDataSource) {

               const genderChildren = await page.$$eval('.pi-item.pi-data.pi-item-spacing', elements => {
                  return elements.filter(data => {
                     return data.getAttribute('data-source') === 'gender';
                  });
               });

               console.log(genderChildren);
               // browser.close();

               // Get the name of the character
               const fileName = name.toLowerCase().split(' ').join('-');
               // Set the file path with the file image name
               const filePath = path.join(__dirname, `./images/${fileName}.png`);
               // Get the image src from the page
               const imgSrc = await page.$eval('.pi-image-thumbnail', e => e.getAttribute('src'));
               // Go src
               const viewSource = await page.goto(imgSrc);
               // buffer the view source
               const buffer = await viewSource.buffer();
               // download the image to the file Path
               await writeFileAsync(filePath, buffer)


               // Push data to the an array of data
               data.push({
                  name: name,
                  imgSrc: imgSrc,
               });
               count += 1;
               console.log(count);
            }
         } catch (error) {
            console.log(error);
         }
      }

      // write everything into a JSON file
      const jsonData = JSON.stringify(data);
      const jsonFilePath = path.join(__dirname, `./data/characters.json`);
      await writeFileAsync(jsonFilePath, jsonData);

   }

}


scrapeData('https://psychonauts.fandom.com/wiki/Category:Characters');