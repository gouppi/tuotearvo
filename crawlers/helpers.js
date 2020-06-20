const models = require("../models/index");
const axios = require("axios").default;
const { Op, QueryTypes } = require("sequelize");
const maps = require("./map");

let brands;

/**
 * Finds and returns Shop with given parameters
 * @param {JSON} params JSON key-value pair search query
 * @example {name: 'Verkkokauppa'}
 * @returns Shop ORM object or NULL
 */
const assignStore = async (name) => {
  return await models.Shop.findOne({ where: { name: name } });
};

/**
 * Checks if name contains brand in it.
 * If brand is not empty but name doesn't contain it, prepend name with brand.
 *
 * @param {string} brand Products brand name
 * @param {string} name Products name as found from shop
 * @returns Product name prepended with possible brand name
 */
const addBrandToName = async (brand, name) => {
  if (brand.length > 0 && !name.toLowerCase().includes(brand.toLowerCase())) {
    name = `${brand} ${name}`;
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const findPrice = async (product, price, shop) => {
  let Price = await models.Price.findOne({
    where: {
      product_id: product.get("id"),
      shop_id: shop.get("id"),
    },
  });

  if (Price) {
    console.log("HInta löydetty. päivitetään");
    Price.changed("updated_at", true);
    Price.changed("price", price);
    await Price.save();
  } else {
    console.log("Hintaa ei löydetty,. luodaan uusi");
    console.log("TuoteID: ", product.get("id"), ", kaupa-id:", shop.get("id"));

    Price = await models.Price.create(
      {
        price: price,
      }
    );
      await product.addPrice(Price);
      await shop.addPrice(Price);
  }
};

/**
 * Tries to find brand based on either direct manufacturer name or product name
 * @param {string} manufacturer
 * @param {StringConstructor} display_name
 */

// TODO : MITEN TÄMÄ SAADAAN SIIRRETTYÄ BRANDS MODELIN ALLE??????

const findBrand = async (brand, display_name) => {
  let Brand = await models.sequelize.query(
    "SELECT * FROM brands WHERE name = :brand OR :display_name ILIKE name || '%'",
    {
      replacements: {
        brand: brand,
        display_name: display_name,
      },
      model: models.Brand,
      plain: true,
    }
  );

  if (!Brand) {
    Brand = await models.Brand.create({
      name: brand,
    });
  }

  if (!Brand) {
    console.log("Cannot create new brand named " + brand);
  }

  return Brand;
};

/**
 * Makes sure that we have necessary data for creating new product.
 * @param {JSON} payload
 * @returns {boolean}
 */
const isDataValidForCreation = async (data) => {
  return true;
};

const createNewProduct = async (p) => {
  console.log("Create New Product");
  let P = null;
  try {
    isDataValidForCreation(p);
    P = await models.Product.create(
      {
        group_name: p.name_parsed,
        name: p.name,
        image: p.image,
        product_eans: p.eans.map((ean) => ({ ean: ean })),
        product_mpns: p.mpns.map((mpn) => ({ mpn: mpn })),
        fetch_data: p,
      },
      {
        include: [
          {
            model: models.Ean,
          },
          {
            model: models.Mpn,
          },
        ],
      }
    );
  } catch (err) {
    console.log(err);
  }

  return P;
};

const createNewFamily = async (name, image) => {
  // TODO: tänne uuden tuoteperheen luontifunktiota
  console.log("Create new Family, name: " + name + ", image: " + image);
  let F = await models.Family.create({
    name: name,
    image: image,
  });
  console.log("Uusi tuoteperhe luotu, iD on: " + F.get("id"));
  return F;
};

const findCategory = async (c) => {
  // From top to bottom
  let C = null;
  try {
    if (null === c) {
      throw new Error(
        "Given category structure is not valid for finding proper category"
      );
    }
    let reverse = c.reverse();
    for (let i = 0; i < reverse.length; i++) {
      const id = reverse[i].id;
      if (id === "6159c") {
        console.log("----------OHEISLAITE DETECTED --------");
        throw new Error("Oheislaitteet ja tarvikkeet, skipping this one");
      }

      let name = reverse[i].name; // "4793c"
      C = await models.Category.findOne({ where: { name: name } });
      if (C) {
        console.log("Found category : " + C.name);
        break;
      }
    }

    if (!C) {
      throw new Error("Can't map categories to any existing one: ", c);
    }
  } catch (err) {
    console.log(err);
  }
  return C;
};

const findFamily = async (name) => {
  let F = null;
  try {
    if (null === name) {
      throw new Error("Cannot find product family without proper search word");
    }
    F = await models.Family.findOne({ where: { name: name } });
    if (!F) {
      throw new Error("Didn't find family with given parameter");
    }
  } catch (err) {
    console.log(err.message);
  }
  return F;
};

/**
 * This function handles the whole data processing in one slot.
 * Crawlers call this function only after data harvesting.
 * @param {JSON} payload contains all necessary information for creating new product, variation.
 * @param {JSON} category contains category name and external code information
 * @param {String} shop Name of the shop, e.g. "Verkkokauppa.com"
 */
const handle = async (payload, shop) => {
  //for (let i = 0; i < payload.length; i++) {

  try {
    let products = await models.Product.findProducts(payload);
    let P = products.shift();
    let C;
    if (!P) {
      console.log("Did not find existing product, lets create new");
      // Try to find suitable family for this product
      let Family = await findFamily(payload.name_parsed);
      C = await findCategory(payload.category);
      //console.log("Family name: " + Family.name);
      // Didn't find one, try to find category + brand for this product and create new family and product
      if (!Family) {
        let B = await findBrand(payload.brand.name, payload.name);
        if (C !== null && B !== null) {
          Family = await createNewFamily(payload.name_parsed, payload.image);
          await Family.setBrand(B);
          await Family.setCategory(C);
        }
      }

      if (!Family) {
        throw new Error("Didn't create new family: " + payload.name_parsed);
      }
      P = await createNewProduct(payload);
      await Family.addProduct(P);
      await C.addProduct(P);
      await P.reload();

    }

    if (!P) {
      throw new Error("Didn't create new product " + payload.name);
    }

    return P;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const createReview = async (reviewData, shop) => {
  try {
    let R = await models.Review.create({
      external_id: reviewData.external_id,
      text: reviewData.reviewText,
      title: reviewData.reviewTitle,
      recommends: reviewData.recommends,
      rating: reviewData.rating,
      //origin: shop.name,
      reviewedAt: reviewData.reviewedAt,
      fetch_data: reviewData,
    //   family: {
    //     id: reviewData.product_family_id,
    //   },
    //   product: {
    //     id: reviewData.product_id
    //   }
    // }, {
    //   include: [
    //     {
    //       association: models.Product
    //     },
    //     {
    //       association: models.Family
    //     }
    //   ]
    });

    let addedReview = await shop.addReview(R);
    //console.log("AddedReview",addedReview);
    let P = await models.Product.findByPk(reviewData.product_id);
    P.addReview(R);
    let F = await models.Family.findByPk(reviewData.product_family_id);
    F.addReview(R);

    return R;
  } catch (err) {
    if ("constraint" in err && err.constraint !== "reviews_external_id_key") {
      console.log(err.detail);
    }
    return null;
  }
};

exports.assignStore = assignStore;
exports.addBrandToName = addBrandToName;
exports.createNewProduct = createNewProduct;
exports.isDataValidForCreation = isDataValidForCreation;
exports.findBrand = findBrand;
exports.handle = handle;
exports.findCategory = findCategory;
exports.createReview = createReview;
exports.findPrice = findPrice;
