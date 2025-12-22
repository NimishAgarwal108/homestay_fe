import { Utensils } from 'lucide-react';
import Typography from "../Typography";
const Dining = () => {
  const menuItems = [
    { category: "Breakfast", items: ["Aloo Paratha with Curd", "Poha & Tea", "Upma with Chutney", "Fresh Fruits & Juice"] },
    { category: "Lunch", items: ["Dal Tadka with Rice", "Rajma Chawal", "Veg Thali", "Paneer Curry with Roti"] },
    { category: "Dinner", items: ["Kadhi Pakora", "Mix Veg with Roti", "Khichdi with Papad", "Local Mountain Cuisine"] },
    { category: "Snacks", items: ["Maggi", "Pakoras", "Sandwich", "Tea/Coffee"] }
  ];

  return (
    <section id="dining" className="py-24 px-6 bg-[#C9A177]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Utensils className="mx-auto text-[#7570BC] mb-4" size={48} />
          <Typography variant="h2" textColor="offWhite" weight="bold" align="center" className="mb-4">
            Home-Cooked Delights
          </Typography>
          <Typography variant="paragraph" textColor="cream" align="center">
            Savor authentic local cuisine made with love
          </Typography>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menuItems.map((menu, idx) => (
            <div key={idx} className="bg-white/90 p-6 rounded-2xl hover:bg-white transition-all shadow-md">
              <Typography variant="h4" textColor="primary" weight="bold" className="mb-4">
                {menu.category}
              </Typography>
              <ul className="space-y-3">
                {menu.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#7570BC] mt-1">•</span>
                    <Typography variant="paragraph" textColor="secondary">
                      {item}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white/80 p-8 rounded-2xl border-2 border-[#7570BC]/30 text-center">
          <Typography variant="paragraph" textColor="secondary" align="center">
            <Typography variant="paragraph" textColor="primary" weight="semibold" as="span">
              Meal Plans:{" "}
            </Typography>
            All meals prepared with fresh, local ingredients. Vegetarian options available. Special dietary requirements? Just let us know!
          </Typography>
        </div>
      </div>
    </section>
  );
};
export default Dining;