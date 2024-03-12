/**
    Problem Statement:
    You are required to build a command line application to
    estimate the total delivery cost of each package with
    an offer code (if applicable).
 */

const offers = {
  OFR001: {
    discount: 10,
    min_distance: 0,
    max_distance: 200,
    min_weight: 70,
    max_weight: 200,
  },
  OFR002: {
    discount: 7,
    min_distance: 50,
    max_distance: 150,
    min_weight: 100,
    max_weight: 250,
  },
  OFR003: {
    discount: 5,
    min_distance: 50,
    max_distance: 250,
    min_weight: 10,
    max_weight: 150,
  },
};

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const package_details = [];
let baseDeliveryCost;
let numberOfPackages;
var total_cost = 0;
var discount_amount = 0;

function questionAsync(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function getInput() {
  const input = await questionAsync(
    "Enter base delivery cost and number of packages (separated by space): "
  );
  [baseDeliveryCost, numberOfPackages] = input.split(" ");

  for (let i = 1; i <= numberOfPackages; i++) {
    const packageDetails = await questionAsync(
      `Enter details for package ${i} (pkg_id pkg_weight_in_kg distance_in_km offer_code): `
    );
    const [package_id, package_weight, distance, offer_code] =
      packageDetails.split(" ");
    package_details.push({ package_id, package_weight, distance, offer_code });
  }

  rl.close();
}

async function calculateCost() {
  await getInput();

  package_details.forEach((ele, index) => {
    total_cost =
      parseInt(baseDeliveryCost) + ele.package_weight * 10 + ele.distance * 5;
    const offer = offers[ele.offer_code];
    if (
      offer &&
      parseInt(ele.distance) >= offer.min_distance &&
      parseInt(ele.distance) <= offer.max_distance &&
      parseInt(ele.package_weight) >= offer.min_weight &&
      parseInt(ele.package_weight) <= offer.max_weight
    ) {
      discount_amount = (total_cost * offer.discount) / 100;
      total_cost -= discount_amount;
    }
    console.log(`${ele.package_id} ${discount_amount} ${total_cost}`);
  });
}
calculateCost();
