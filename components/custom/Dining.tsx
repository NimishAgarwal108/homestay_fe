import { menuItems } from "@/app/constant";
import { Utensils } from "lucide-react";
import Typography from "../Typography";
import FoodMenuSlider from "../background/FoodMenuSlider";

const Dining = () => {
  return (
    <section
      id="dining"
      className="relative min-h-[700px] sm:min-h-[800px] lg:min-h-[900px] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background Slider */}
      <FoodMenuSlider />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <Utensils className="mx-auto text-white mb-4" size={36} />
          <Typography
            variant="h2"
            textColor="offWhite"
            weight="bold"
            align="center"
            className="mb-4"
          >
            Home-Cooked Delights
          </Typography>
          <Typography variant="paragraph" textColor="cream" align="center">
            Savor authentic local cuisine made with love
          </Typography>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {menuItems.map((menu, idx) => (
            <div
              key={idx}
              className="bg-white/90 p-5 sm:p-6 rounded-2xl shadow-md backdrop-blur"
            >
              <Typography
                variant="h4"
                textColor="primary"
                weight="bold"
                className="mb-4"
              >
                {menu.category}
              </Typography>
              <ul className="space-y-3">
                {menu.items.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#7570BC]">•</span>
                    <Typography variant="paragraph" textColor="secondary">
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 bg-white/80 p-5 sm:p-8 rounded-2xl border-2 border-[#7570BC]/30 text-center">
          <Typography variant="paragraph" textColor="secondary" align="center">
            <Typography
              variant="paragraph"
              textColor="primary"
              weight="semibold"
              as="span"
            >
              Meal Plans:{" "}
            </Typography>
            All meals prepared with fresh, local ingredients. Vegetarian options
            available. Special dietary requirements? Just let us know!
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default Dining;
