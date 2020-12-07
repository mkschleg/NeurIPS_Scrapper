# NeurIPS_Scrapper
Scrap data from neurips list of papers.


To use make sure you are in the “mini” display on the website for any list of papers. Load the `scrapper.js` file then run `scrape_all_info("my-download.csv")`. And you will see numbers counting up. It is slow, but faster than I would be.

This has only been lightly tested and works on safari (but likely all browsers). Pull requests welcome.

It captures papername, authors, date of poster session, poster session number, conference link, and paper link. You can modify the `scrape_info` function if you want different types of data.
