/**
 * This file is to read input from the user
 */

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function questionAsync(prompt) {
  return new Promise((resolve, reject) => {
    rl.question(prompt, (answer) => {
      if (answer.trim() === "") {
        reject(new Error("Input cannot be empty"));
      } else {
        resolve(answer.trim());
      }
    });
  });
}

async function getInput() {
  try {
    const [base_delivery_cost, no_of_packages] = (
      await questionAsync(
        "Enter base delivery cost and number of packages (separated by space): "
      )
    ).split(" ");

    if (isNaN(base_delivery_cost) || isNaN(no_of_packages)) {
      throw new Error(
        "Base delivery cost and number of packages must be numeric"
      );
    }

    const package_details = [];

    for (let i = 1; i <= parseInt(no_of_packages); i++) {
      const [package_id, package_weight, distance, offer_code] = (
        await questionAsync(
          `Enter details for package ${i} (pkg_id pkg_weight_in_kg distance_in_km offer_code): `
        )
      ).split(" ");

      if (isNaN(package_weight) || isNaN(distance)) {
        throw new Error(
          `Package weight and distance for package ${i} must be numeric`
        );
      }

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

    if (
      isNaN(no_of_vehicles) ||
      isNaN(vehicle_max_speed) ||
      isNaN(vehicle_max_weight)
    ) {
      throw new Error(
        "Number of vehicles, max speed, and max weight must be numeric"
      );
    }

    const vehicles_data = Array.from(
      { length: parseInt(no_of_vehicles) },
      (_, idx) => ({ vehicle_no: idx + 1, vehicle_available_time: 0 })
    );

    return {
      base_delivery_cost,
      no_of_packages,
      package_details,
      vehicles_data,
      vehicle_max_speed,
      vehicle_max_weight,
    };
  } catch (error) {
    console.error("Error while getting input:", error.message);
    rl.close();
    process.exit(1); // Exit the process with a non-zero code indicating failure
  }
}

module.exports = { getInput };
