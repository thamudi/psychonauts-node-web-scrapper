'use strict';
const puppeteer = require('puppeteer');

// TODO: Alright, so before writing any stupid code tamim we will need to outline some things

/*
================================================================================================
================================================================================================
============================================ GOALS =============================================

1- We need to go to the Characters page [check]
2- We need to access the page [check]
3- Find the place containing all of the Data we want, in this case it the container containing 
   the members data (name, link) [check]
4- Get An array of all the containers [check]
   1. Loop through this containers [check]
   2. find all the links [check]
   3. go to the page [check]
   4. get the image and the name of the character
   5. save the image in a folder with the character's name
   6. go back to the previous page again; basically reset to the Characters Page
   7. loop over
   8. profit 

- Some helpful links:

https://pptr.dev/#?product=Puppeteer&version=v9.1.1&show=api-class-page
https://pptr.dev/#?product=Puppeteer&version=v9.1.1&show=api-pageselector
https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll

================================================================================================
================================================================================================
================================================================================================
*/

const scrapeData = async (url) => {
   const browser = await puppeteer.launch({ headless: false });
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


      console.log(queriedPageMembers);

      const data = [];

      for (const { name, link } of queriedPageMembers) {
         await Promise.all([
            page.waitForNavigation(),
            page.goto(link),
            page.waitForSelector('.pi-item.pi-item-spacing.pi-title'),
         ]);

         const info = await page.$eval('.pi-item.pi-item-spacing.pi-title', e => e.innerText);

         data.push({
            name: name,
            information: info,
         });
      }

      console.log(data);

   }

}


scrapeData('https://psychonauts.fandom.com/wiki/Category:Characters');