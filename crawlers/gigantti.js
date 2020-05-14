const Crawler = require('crawler');
const HCCrawler = require('headless-chrome-crawler');

(async () => {
    var c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : async function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                $('.product-image-link').each(async (i, link)=> {
                    // Await että osataan sulkea crawler ajo kun nämä kaikki on suoritettu
                    await crawler.queue($(link).attr('href'));
                });
            }
            done();
        }
    });

  const crawler = await HCCrawler.launch({
    // Function to be evaluated in browsers
    evaluatePage: (() => ({
        display_name: $(".product-title").html(),
        manufacturer: $(".spec-table td:contains(Merkki)").next('td').html(),
        model: $(".spec-table td:contains(Malli)").next('td').html(),
        color: $(".spec-table td:contains(Valmistajan värinimi)").next('td').html(),
        model_id: $(".spec-table td:contains(Mallin tunnistusnumero)").next('td').html(),
        ean: $(".spec-table td:contains(EAN-koodi)").next('td').html(),
    })),
    // Function to be called with evaluated results from browsers
    onSuccess: (result => {
      console.log("------TUOTE-----");
      console.log(result.result.display_name);
      console.log(result.result.manufacturer);
      console.log(result.result.model);
      console.log(result.result.color);
      console.log(result.result.model_id);
      console.log(result.result.ean);
    }),
  });

  console.log("Haetaan Iphone 11 hakusanaa vastaavat puhelimet ja laitetaan jokainen crawlauksen alle");
  await c.queue('https://www.gigantti.fi/catalog/puhelimet-ja-gps/fi-puhelimet/puhelimet?SearchParameter=%26%40QueryTerm%3D*%26ContextCategoryUUID%3DstmsGQV5fqMAAAFDI7k2st6C%26discontinued%3D0%26Malli%3DiPhone%2B11%2BPro%26ManufacturerName%3DApple%26online%3D1%26%40Sort.ViewCount%3D1%26%40Sort.ProductListPrice%3D0&PageSize=12&ProductElementCount=&searchResultTab=Products&CategoryName=fi-puhelimet&CategoryDomainName=store-gigantti-ProductCatalog#filter-sidebar');
  await crawler.onIdle();
  console.log("Nyt on crawler callback ootellut että tuosesivun crawler on idle, suljetaan");
  await crawler.close(); // Close the crawler
})();





