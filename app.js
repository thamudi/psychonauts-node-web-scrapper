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
   the members data (name, link)
4- Get An array of all the containers 
   1. Loop through this containers
   2. find all the links
   3. go to the page
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

    // if (await page.$('.category-page__members')) {
    //     if (await page.$$('.category-page__members-wrapper')) {
    //         while(await (await page.$$('.category-page__members-wrapper')).length){
    //             while(await(await page.$$('.category-page__member')).length){

    //             }
    //         }
    //     }
    // }

    browser.close();

}

scrapeData('https://psychonauts.fandom.com/wiki/Category:Characters');