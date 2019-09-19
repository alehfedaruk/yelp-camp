let mongoose = require("mongoose");
let Campground = require("./models/campground");
var Comment = require("./models/comment");

const data = [
  {
    name: "Palisades State Park",
    image:
      "https://www.planetware.com/photos-large/USSD/south-dakota-garretson-palisades-state-park-rock-and-river.jpg",
    description:
      "Defined by the towering pink Sioux Quartzite jutting along the shores of Split Rock Creek, Palisades State Park provides a unique environment to explore in eastern South Dakota. Visitors to Palisades State Park enjoy hiking the creekside trails that expose the rocky environment, and for those with the right gear and experience, participating in some of the best rock climbing on the eastern side of the state."
  },
  {
    name: "Redfish Lake",
    image:
      "https://visitidaho.org/content/uploads/2018/03/RedfishLake_SaraSheehy-700x467.jpg",
    description:
      "Redfish Lake, located near Stanley, Idaho, is such a beautiful spot that even the locals reserve campsites here. At 6,500 feet above sea level, the lake has turquoise blue, glacier-fed water and sandy shores. The sunsets are unbelievable, but the sunrises are even better. The northeast end of the lake has five campgrounds and another two are located on Little Redfish Lake."
  },
  {
    name: "North Fork Campground",
    image:
      "https://www.planetware.com/photos-large/USWY/wyoming-cody-buffalo-bill-state-park-shoshone-river.jpg",
    description:
      "Located just east of Yellowstone National Park on the shores of the Buffalo Bill Reservoir, an impoundment of the Shoshone River, Buffalo Bill State Park delivers on a landscape that rivals its national park neighbors. Offering two developed campground areas, and an additional group camping area by reservation only, every camping spot features outstanding views of the nearby Absaroka Mountain Range."
  }
];

function seedDB() {
  Campground.deleteMany({}, err => {
    if (err) {
      console.log(err);
    }
    console.log("removed camps");
    data.forEach(seed => {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log(err);
        }
        console.log(`Added a camp ${campground}`);
        Comment.create(
          { text: "That was just grate", author: "Judice" },
          (err, comment) => {
            if (err) {
              console.log(err);
            }
            campground.comments.push(comment);
            campground.save();
            console.log("Create new comment");
          }
        );
      });
    });
  });
}

module.exports = seedDB;
