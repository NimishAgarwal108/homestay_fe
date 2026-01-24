import Typography from "@/components/layout/Typography";
import { Car, Coffee, Mountain, Trees, Utensils, Wifi } from 'lucide-react';

const Amenities = () => {
  const amenities = [
    { icon: Wifi, title: "High-Speed WiFi", desc: "Stay connected even in the mountains" },
    { icon: Utensils, title: "Home-Cooked Meals", desc: "Serving local delicacies" },
    { icon: Car, title: "Free Parking", desc: "Secured parking" },
    { icon: Mountain, title: "Mountain Treks", desc: "Guided hiking trails nearby" },
    { icon: Trees, title: "Nature Walks", desc: "Scenic forest paths" },
    { icon: Coffee, title: "24/7 Tea/Coffee", desc: "Beverages anytime" }
  ];

  return (
    <section
      id="amenities"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-[#BFC7DE]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Typography
            variant="h2"
            textColor="primary"
            weight="bold"
            align="center"
            className="mb-4"
          >
            Amenities & Facilities
          </Typography>
          <Typography variant="paragraph" textColor="secondary" align="center">
            Everything you need for a comfortable mountain retreat
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {amenities.map((amenity, idx) => (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-2xl hover:shadow-xl transition-all group"
            >
              <amenity.icon
                className="text-[#7570BC] mb-4 group-hover:scale-110 transition-transform"
                size={36}
              />
              <Typography
                variant="h4"
                textColor="primary"
                weight="semibold"
                className="mb-2"
              >
                {amenity.title}
              </Typography>
              <Typography variant="paragraph" textColor="secondary">
                {amenity.desc}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
