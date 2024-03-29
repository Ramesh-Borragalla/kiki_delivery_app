const offers = require("./offers");

function calculate_delivery_cost(base_delivery_cost, package_details) {
  package_details.forEach((ele, index) => {
    let total_cost =
      parseInt(base_delivery_cost) +
      parseInt(ele.package_weight) * 10 +
      parseInt(ele.distance) * 5;
    const offer = offers[ele.offer_code];
    let discount_amount = 0; // Default to zero

    if (
      offer &&
      parseInt(ele.distance) >= offer.min_distance &&
      parseInt(ele.distance) <= offer.max_distance &&
      parseInt(ele.package_weight) >= offer.min_weight &&
      parseInt(ele.package_weight) <= offer.max_weight
    ) {
      discount_amount = parseInt(total_cost * parseInt(offer.discount)) / 100;
      total_cost -= parseInt(discount_amount);
    }

    ele.discount = discount_amount; // Assign the discount amount
    ele.total_cost = parseInt(total_cost);
  });
  return package_details;
}

module.exports = calculate_delivery_cost;
