// "use strict";
// /* -------------------------------------------------------
//     | FULLSTACK TEAM | NODEJS / EXPRESS |
// ------------------------------------------------------- */
// // Car Controller:

// const Car = require("../models/car");

// const Reservation = require("../models/reservation");

// module.exports = {
//   list: async (req, res) => {
//     /*
//             #swagger.tags = ["Cars"]
//             #swagger.summary = "List Cars"
//             #swagger.description = `
//                 You can send query with endpoint for search[], sort[], page and limit.
//                 <ul> Examples:
//                     <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
//                     <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
//                     <li>URL/?<b>page=2&limit=1</b></li>
//                 </ul>
//             `
//         */

//     const { startDate, endDate } = req.query.filter || {};
//     let customFilter = {};

//     if (startDate && endDate) {
//       const unavailableCarIds = await Reservation.find({
//         $or: [
//           {
//             startDate: { $lte: endDate },
//             endDate: { $gte: startDate },
//           },
//         ],
//       }).distinct("carId");

//       customFilter = { _id: { $nin: unavailableCarIds } };
//     }

//     const data = await res.getModelList(Car, customFilter);

//     res.status(200).send({
//       error: false,
//       details: await res.getModelListDetails(Car, customFilter),
//       data,
//     });
//   },

//   create: async (req, res) => {
//     /*
//             #swagger.tags = ["Cars"]
//             #swagger.summary = "Create Car"
//             #swagger.parameters['body'] = {
//                 in: 'body',
//                 required: true,
//                 schema: {
//                     "plateNumber": "34ABC345",
//                     "brand": "Opel",
//                     "model": "Astra",
//                     "year": 2021,
//                     "isAutomatic": false,
//                     "pricePerDay": 189.99,
//                     "isPublish": false
//                 }
//             }
//         */

//     const data = await Car.create(req.body);

//     res.status(201).send({
//       error: false,
//       data,
//     });
//   },

//   read: async (req, res) => {
//     /*
//             #swagger.tags = ["Cars"]
//             #swagger.summary = "Get Single Car"
//         */

//     const data = await Car.findOne({ _id: id });

//     res.status(200).send({
//       error: false,
//       data,
//     });
//   },

//   update: async (req, res) => {
//     /*
//             #swagger.tags = ["Cars"]
//             #swagger.summary = "Update Car"
//             #swagger.parameters['body'] = {
//                 in: 'body',
//                 required: true,
//                 schema: {
//                     "plateNumber": "34ABC345",
//                     "brand": "Opel",
//                     "model": "Astra",
//                     "year": 2021,
//                     "isAutomatic": false,
//                     "pricePerDay": 189.99,
//                     "isPublish": false
//                 }
//             }
//         */

//     const data = await Car.updateOne({ _id: req.params.id }, req.body, {
//       runValidators: true,
//     });

//     res.status(202).send({
//       error: false,
//       data,
//       new: await Car.findOne({ _id: req.params.id }),
//     });
//   },

//   delete: async (req, res) => {
//     /*
//             #swagger.tags = ["Cars"]
//             #swagger.summary = "Delete Car"
//         */

//     const data = await Car.deleteOne({ _id: req.params.id });

//     res.status(data.deletedCount ? 204 : 404).send({
//       error: !data.deletedCount,
//       data,
//     });
//   },
// };



const Car = require("../models/car");
const Reservation = require("../models/reservation");
const formatDate = require("../helpers/dateToLocaleString"); // Yardımcı fonksiyonu import edin

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "List Cars"
            #swagger.description = `
                You can send query with endpoint for search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                    <li>URL/?<b>filter[startDate]=2024-08-01&filter[endDate]=2024-08-30</b></li>
                </ul>
            `
        */

    const { startDate, endDate } = req.query.filter || {};
    let customFilter = {};

    if (startDate && endDate) {
      const unavailableCarIds = await Reservation.find({
        $or: [
          {
            startDate: { $lte: endDate },
            endDate: { $gte: startDate },
          },
        ],
      }).distinct("carId");

      customFilter = { _id: { $nin: unavailableCarIds } };
    }

    const data = await res.getModelList(Car, customFilter);

    // Tarih alanlarını formatlamak için yardımcı fonksiyonu kullanın
    const formattedData = data.map((car) => ({
      ...car._doc,
      createdAt: formatDate(new Date(car.createdAt)),
      updatedAt: formatDate(new Date(car.updatedAt)),
    }));

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Car, customFilter),
      data: formattedData,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Create Car"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "plateNumber": "34ABC345",
                    "brand": "Opel",
                    "model": "Astra",
                    "year": 2021,
                    "isAutomatic": false,
                    "pricePerDay": 189.99,
                    "isPublish": false
                }
            }
        */

    const data = await Car.create(req.body);

    res.status(201).send({
      error: false,
      data,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Get Single Car"
    */

    const data = await Car.findOne({ _id: req.params.id });

    // Tarih alanlarını formatlamak için yardımcı fonksiyonu kullanın
    const formattedData = {
      ...data._doc,
      createdAt: formatDate(new Date(data.createdAt)),
      updatedAt: formatDate(new Date(data.updatedAt)),
    };

    res.status(200).send({
      error: false,
      data: formattedData,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Update Car"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                 schema: {
                    "plateNumber": "34ABC345",
                    "brand": "Opel",
                    "model": "Astra",
                    "year": 2021,
                    "isAutomatic": false,
                    "pricePerDay": 189.99,
                    "isPublish": false
                }
            }
        */

    const data = await Car.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
    });

    const newCar = await Car.findOne({ _id: req.params.id });

    // Tarih alanlarını formatlamak için yardımcı fonksiyonu kullanın
    const formattedData = {
      ...newCar._doc,
      createdAt: formatDate(new Date(newCar.createdAt)),
      updatedAt: formatDate(new Date(newCar.updatedAt)),
    };

    res.status(202).send({
      error: false,
      data,
      new: formattedData,
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Cars"]
            #swagger.summary = "Delete Car"
    */

    const data = await Car.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
