/**
    Problem Statement 1:
    You are required to build a command line application to
    estimate the total delivery cost of each package with
    an offer code (if applicable).
 */

/**
    Proble Statement 2:
    You are required to build a command line application to 
    calculate the estimated delivery time for every package by 
    maximizing no. of packages in every shipment.
 */

// defining offers
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

let baseDeliveryCost;
let numberOfPackages;
var total_cost = 0;
var no_of_vehicles;
var vehicle_max_speed;
var vehicle_max_weight;
let package_details = [];
let vehicles_data;

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

  for (let i = 1; i <= parseInt(numberOfPackages); i++) {
    const packageDetails = await questionAsync(
      `Enter details for package ${i} (pkg_id pkg_weight_in_kg distance_in_km offer_code): `
    );
    const [package_id, package_weight, distance, offer_code] =
      packageDetails.split(" ");
    package_details.push({
      package_id,
      package_weight: parseInt(package_weight),
      distance: parseInt(distance),
      offer_code,
      is_vehicle_arranged: false,
      estimated_delivery_time: null,
      vehicle_number: null,
    });
  }

  const vehicle_details = await questionAsync(
    "Enter details for no_of_vehicles max_speed vehicleMaxWeight (separated by space): "
  );
  [no_of_vehicles, vehicle_max_speed, vehicle_max_weight] =
    vehicle_details.split(" ");
  vehicles_data = Array.from(
    { length: parseInt(no_of_vehicles) },
    (each, idx) => {
      return {
        vehicle_no: idx + 1,
        vehicle_available_time: 0,
      };
    }
  );
}

async function calculateDeliveryEstimation(packages) {
  const packages_filtered = packages.filter(
    (each) => each.is_vehicle_arranged == false
  );
  vehicles_data.sort(
    (a, b) => a.vehicle_available_time - b.vehicle_available_time
  );
  if (packages_filtered.length > 0) {
    for (let i = 0; i < vehicles_data.length; i++) {
      await processVehicle(vehicles_data[i], packages_filtered);
    }
    calculateDeliveryEstimation(package_details);
  } else {
    package_details.forEach((ele) => {
      console.log(
        `${ele.package_id} ${ele.discount} ${
          ele.total_cost
        } ${ele.estimated_delivery_time.toFixed(2)}`
      );
    });
    return;
  }
}

async function processVehicle(vehicle, packages) {
  let current_vehicle_details = [];
  if (packages.length <= 0) return;
  if (packages.length == 1 && packages[0].is_vehicle_arranged == false) {
    current_vehicle_details.push(...packages);
  } else {
    let combo_weight = 0;
    for (let j = 0; j < packages.length; j++) {
      if (packages[j].is_vehicle_arranged == false) {
        for (let k = j + 1; k < packages.length; k++) {
          if (packages[k].is_vehicle_arranged == false) {
            let sum =
              parseInt(packages[j].package_weight) +
              parseInt(packages[k].package_weight);
            if (sum >= combo_weight && sum <= parseInt(vehicle_max_weight)) {
              combo_weight = sum;
              current_vehicle_details = [];
              current_vehicle_details.push(packages[j]);
              current_vehicle_details.push(packages[k]);
            } else {
              if (sum > parseInt(combo_weight)) {
                let single_weight =
                  parseInt(packages[j].package_weight) >
                  parseInt(packages[k].package_weight)
                    ? packages[j]
                    : packages[k];
                if (parseInt(single_weight.package_weight) > combo_weight) {
                  combo_weight = parseInt(single_weight.package_weight);
                  current_vehicle_details = [];
                  current_vehicle_details.push(single_weight);
                }
              }
            }
          }
        }
      }
    }
  }

  for (let l = 0; l < current_vehicle_details.length; l++) {
    current_vehicle_details[l].is_vehicle_arranged = true;
    current_vehicle_details[l].estimated_delivery_time =
      vehicle.vehicle_available_time +
      parseInt(current_vehicle_details[l].distance) /
        parseInt(vehicle_max_speed);
    current_vehicle_details[l].vehicle_number = vehicle.vehicle_no;

    for (let m = 0; m < package_details.length; m++) {
      if (
        current_vehicle_details[l].package_id == package_details[m].package_id
      ) {
        package_details[m].is_vehicle_arranged = true;
        package_details[m].estimated_delivery_time =
          vehicle.vehicle_available_time +
          parseInt(current_vehicle_details[l].distance) /
            parseInt(vehicle_max_speed);
        package_details[m].vehicle_number = vehicle.vehicle_no;
      }
    }
  }

  let filter = current_vehicle_details
    .map((each) => each.estimated_delivery_time)
    .sort((a, b) => b - a);
  if (filter.length > 0) {
    vehicle.vehicle_available_time =
      vehicle.vehicle_available_time + 2 * filter?.[0];
  }
}

async function calculateCost() {
  await getInput();

  package_details.forEach((ele, index) => {
    let discount_amount = 0;
    total_cost =
      parseInt(baseDeliveryCost) +
      parseInt(ele.package_weight) * 10 +
      parseInt(ele.distance) * 5;
    const offer = offers[ele.offer_code];
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
    ele.discount = parseInt(discount_amount);
    ele.total_cost = parseInt(total_cost);
  });

  let result = await calculateDeliveryEstimation(package_details);
  rl.close();
}

calculateCost();
