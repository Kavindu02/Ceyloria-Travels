const mongoose = require("mongoose");
const dotenv = require("dotenv");
const TravelPackage = require("./models/travelPackage.js");

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    // Simulate frontend payload when form is filled simply
    const dummyPkg = {
      title: "Test Package",
      shortDescription: "Short",
      description: "Desc",
      price: "1500", // Comes as string from input
      duration: "3 Days",
      citiesCovered: [""], // User might not fill the default first input
      highlights: [""],
      inclusions: [""],
      exclusions: [""],
      images: []
    };

    const pkg = new TravelPackage(dummyPkg);
    await pkg.save();
    console.log("SAVE SUCCESS");
    
    await TravelPackage.findByIdAndDelete(pkg._id);
    process.exit(0);
  } catch (err) {
    console.log("--- ERROR START ---");
    console.log(err.message);
    if (err.errors) {
        Object.keys(err.errors).forEach(key => {
            console.log(`Field ${key}: ${err.errors[key].message}`);
        });
    }
    console.log("--- ERROR END ---");
    process.exit(1);
  }
}

test();
