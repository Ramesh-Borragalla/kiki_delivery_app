async function estimated_delivery_time(
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
    estimated_delivery_time(
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
            const sum =
              parseInt(packages[j].package_weight) +
              parseInt(packages[k].package_weight);
            if (sum >= combo_weight && sum <= parseInt(vehicle_max_weight)) {
              combo_weight = sum;
              current_vehicle_details = [packages[j], packages[k]];
            } else {
              const single_weight =
                parseInt(packages[j].package_weight) >
                parseInt(packages[k].package_weight)
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

module.exports = estimated_delivery_time;
