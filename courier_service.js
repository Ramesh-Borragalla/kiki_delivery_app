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

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

async function questionAsync(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function getInput() {
  const [baseDeliveryCost, numberOfPackages] = (
    await questionAsync(
      "Enter base delivery cost and number of packages (separated by space): "
    )
  ).split(" ");
  const package_details = [];

  for (let i = 1; i <= parseInt(numberOfPackages); i++) {
    const [package_id, package_weight, distance, offer_code] = (
      await questionAsync(
        `Enter details for package ${i} (pkg_id pkg_weight_in_kg distance_in_km offer_code): `
      )
    ).split(" ");
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

  const [no_of_vehicles, vehicle_max_speed, vehicle_max_weight] = (
    await questionAsync(
      "Enter details for no_of_vehicles max_speed vehicleMaxWeight (separated by space): "
    )
  ).split(" ");
  const vehicles_data = Array.from(
    { length: parseInt(no_of_vehicles) },
    (_, idx) => ({ vehicle_no: idx + 1, vehicle_available_time: 0 })
  );

  return {
    baseDeliveryCost,
    package_details,
    vehicles_data,
    vehicle_max_speed,
    vehicle_max_weight,
  };
}

async function calculateEstimatedDeliveryTime(
  package_details,
  vehicles_data,
  vehicle_max_speed,
  vehicle_max_weight
) {
  const packages_filtered = package_details.filter(
    (each) => !each.is_vehicle_arranged
  );
  vehicles_data.sort(
    (a, b) => a.vehicle_available_time - b.vehicle_available_time
  );

  if (packages_filtered.length > 0) {
    for (const vehicle of vehicles_data) {
      await processVehicle(
        vehicle,
        packages_filtered,
        vehicle_max_speed,
        vehicle_max_weight
      );
    }
    calculateEstimatedDeliveryTime(
      package_details,
      vehicles_data,
      vehicle_max_speed,
      vehicle_max_weight
    );
  } else {
    package_details.forEach((ele) =>
      console.log(
        `${ele.package_id} ${ele.discount} ${
          ele.total_cost
        } ${ele.estimated_delivery_time.toFixed(2)}`
      )
    );
    return;
  }
}

async function processVehicle(
  vehicle,
  packages,
  vehicle_max_speed,
  vehicle_max_weight
) {
  let current_vehicle_details = [];

  if (packages.length <= 0) return;

  if (packages.length === 1 && !packages[0].is_vehicle_arranged) {
    current_vehicle_details.push(...packages);
  } else {
    let combo_weight = 0;
    for (let j = 0; j < packages.length; j++) {
      if (!packages[j].is_vehicle_arranged) {
        for (let k = j + 1; k < packages.length; k++) {
          if (!packages[k].is_vehicle_arranged) {
            const sum = packages[j].package_weight + packages[k].package_weight;
            if (sum >= combo_weight && sum <= vehicle_max_weight) {
              combo_weight = sum;
              current_vehicle_details = [packages[j], packages[k]];
            } else {
              const single_weight =
                packages[j].package_weight > packages[k].package_weight
                  ? packages[j]
                  : packages[k];
              if (single_weight.package_weight > combo_weight) {
                combo_weight = single_weight.package_weight;
                current_vehicle_details = [single_weight];
              }
            }
          }
        }
      }
    }
  }

  for (const package of current_vehicle_details) {
    package.is_vehicle_arranged = true;
    package.estimated_delivery_time =
      vehicle.vehicle_available_time + package.distance / vehicle_max_speed;
    package.vehicle_number = vehicle.vehicle_no;
  }

  const filter = current_vehicle_details
    .map((each) => each.estimated_delivery_time)
    .sort((a, b) => b - a);
  if (filter.length > 0) {
    vehicle.vehicle_available_time += 2 * filter[0];
  }
}

async function calculateCost() {
  const {
    baseDeliveryCost,
    package_details,
    vehicles_data,
    vehicle_max_speed,
    vehicle_max_weight,
  } = await getInput();

  package_details.forEach((ele, index) => {
    let total_cost =
      parseInt(baseDeliveryCost) +
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

  await calculateEstimatedDeliveryTime(
    package_details,
    vehicles_data,
    vehicle_max_speed,
    vehicle_max_weight
  );
  rl.close();
}

calculateCost();
