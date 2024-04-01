const calculate_delivery_cost = require("../calculate_delivery_cost");

describe("getDeliveryCost", function () {
  let package_details;
  it("calculate_delivery_cost should return valid response object", async function () {
    const input_object = {
      base_delivery_cost: "100",
      no_of_packages: "5",
      package_details: [
        {
          package_id: "PKG1",
          package_weight: 50,
          distance: 30,
          offer_code: "OFR001",
          is_vehicle_arranged: false,
          estimated_delivery_time: null,
          vehicle_number: null,
        },

        {
          package_id: "PKG2",
          package_weight: 75,
          distance: 125,
          offer_code: "OFR0008",
          is_vehicle_arranged: false,
          estimated_delivery_time: null,
          vehicle_number: null,
        },
        {
          package_id: "PKG3",
          package_weight: 175,
          distance: 100,
          offer_code: "OFR0003",
          is_vehicle_arranged: false,
          estimated_delivery_time: null,
          vehicle_number: null,
        },
        {
          package_id: "PKG4",
          package_weight: 110,
          distance: 60,
          offer_code: "OFR0002",
          is_vehicle_arranged: false,
          estimated_delivery_time: null,
          vehicle_number: null,
        },
        {
          package_id: "PKG5",
          package_weight: 155,
          distance: 95,
          offer_code: "NA",
          is_vehicle_arranged: false,
          estimated_delivery_time: null,
          vehicle_number: null,
        },
      ],
      vehicles_data: [
        { vehicle_no: 1, vehicle_available_time: 0 },
        { vehicle_no: 2, vehicle_available_time: 0 },
      ],
      vehicle_max_speed: "100",
      vehicle_max_weight: "70",
    };
    package_details = await calculate_delivery_cost(
      input_object.base_delivery_cost,
      input_object.package_details
    );

    expect(typeof package_details).toBe("object");
  });

  it("should contain an array of objects", () => {
    expect(Array.isArray(package_details)).toBe(true);
    expect(package_details.length).toBeGreaterThan(0);
    expect(typeof package_details[0]).toBe("object");
  });

  it("each object should have specific properties and values", () => {
    package_details.forEach((packageDetail) => {
      expect(packageDetail.package_id).toBeDefined();
      expect(typeof packageDetail.package_id).toBe("string");

      expect(packageDetail.package_weight).toBeDefined();
      expect(typeof packageDetail.package_weight).toBe("number");

      expect(packageDetail.distance).toBeDefined();
      expect(typeof packageDetail.distance).toBe("number");

      expect(packageDetail.offer_code).toBeDefined();
      expect(typeof packageDetail.offer_code).toBe("string");

      expect(packageDetail.is_vehicle_arranged).toBeDefined();
      expect(typeof packageDetail.is_vehicle_arranged).toBe("boolean");

      expect(packageDetail.estimated_delivery_time).toBeDefined();
      expect(packageDetail.estimated_delivery_time).toBeNull();

      expect(packageDetail.vehicle_number).toBeDefined();
      expect(packageDetail.vehicle_number).toBeNull();

      expect(packageDetail.discount).toBeDefined();
      expect(typeof packageDetail.discount).toBe("number");

      expect(packageDetail.total_cost).toBeDefined();
      expect(typeof packageDetail.total_cost).toBe("number");
    });
  });
});
