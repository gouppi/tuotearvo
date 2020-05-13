const HCCrawler = require('headless-chrome-crawler');

(async () => {
  const crawler = await HCCrawler.launch({
    // Function to be evaluated in browsers
    evaluatePage: (() => ({
        manufacturer: $(".spec-table td:contains(Merkki)").next('td').html(),
        model: $(".spec-table td:contains(Malli)").next('td').html(),
        color: $(".spec-table td:contains(Valmistajan värinimi)").next('td').html(),
        model_id: $(".spec-table td:contains(Mallin tunnistusnumero)").next('td').html(),
        ean: $(".spec-table td:contains(EAN-koodi)").next('td').html(),
    })),
    // Function to be called with evaluated results from browsers
    onSuccess: (result => {
      console.log(result.result.manufacturer);
      console.log(result.result.model);
      console.log(result.result.color);
      console.log(result.result.model_id);
      console.log(result.result.ean);
    }),
  });
  // Queue a request
  await crawler.queue('https://www.gigantti.fi/product/puhelimet-ja-gps/puhelimet/52779/iphone-11-pro-256-gb-tahtiharmaa');
  await crawler.onIdle(); // Resolved when no queue is left
  await crawler.close(); // Close the crawler
})();