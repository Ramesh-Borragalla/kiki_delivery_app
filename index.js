const { getInput } = require("./input_output");
const calculateCost = require("./calculate_delivery_cost");
const calculateEstimatedDeliveryTime = require("./estimated_delivery_time");

async function main() {
  const input = await getInput();
  const package_details = await calculateCost(
    input.base_delivery_cost,
    input.package_details
  );

  const result = calculateEstimatedDeliveryTime(
    package_details,
    input.vehicles_data,
    input.vehicle_max_speed,
    input.vehicle_max_weight
  );

  result.forEach((ele) =>
    console.log(
      `${ele.package_id} ${ele.discount} ${
        ele.total_cost
      } ${ele.estimated_delivery_time.toFixed(2)}`
    )
  );
}

main();
