import { Car, Coffee, Mountain, Trees, Utensils, Wifi, } from "lucide-react";
const URL = {
  HOMESTAY_LOGO: "/images/HomeStayHeading.jpg",
  LOCATION:"Rudraprayag, Uttarakhand, India (246171)",
  PHOME_NO:"+91 9876543210",
  EMAIL:"aamantran@gmail.com",
  ALTITUDE:"2936 m",
  AVG_TEMP:"(0-10 °C) Winter | (20-35 °C) Summer",
  LOGO:"/images/logo.jpeg",
  LOGO_NAME:"/images/logoImage",
} as const;

export default URL;

export const RoomsType=  [
    {
      name: "Deluxe Mountain View",
      capacity: 2,
      price: 3500,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
      features: ["King Bed", "Mountain View", "Private Balcony", "Attached Bath"]
    },
    {
      name: "Family Suite",
      capacity: 4,
      price: 5500,
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop",
      features: ["2 Bedrooms", "Living Area", "Valley View", "Kitchenette"]
    },
    {
      name: "Cozy Mountain Cabin",
      capacity: 3,
      price: 4200,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
      features: ["Queen + Single", "Fireplace", "Garden View", "Tea Corner"]
    }
  ];

  export const menuItems = [
    { category: "Breakfast", items: ["Aloo Paratha with Curd", "Poha & Tea", "Upma with Chutney", "Fresh Fruits & Juice"] },
    { category: "Lunch", items: ["Dal Tadka with Rice", "Rajma Chawal", "Veg Thali", "Paneer Curry with Roti"] },
    { category: "Dinner", items: ["Kadhi Pakora", "Mix Veg with Roti", "Khichdi with Papad", "Local Mountain Cuisine"] },
    { category: "Snacks", items: ["Maggi", "Pakoras", "Sandwich", "Tea/Coffee"] }
  ];

  export const amenities = [
    { icon: Wifi, title: "High-Speed WiFi", desc: "Stay connected even in the mountains" },
    { icon: Utensils, title: "Home-Cooked Meals", desc: "3 meals a day included" },
    { icon: Car, title: "Free Parking", desc: "Secure parking for your vehicle" },
    { icon: Mountain, title: "Mountain Treks", desc: "Guided hiking trails nearby" },
    { icon: Trees, title: "Nature Walks", desc: "Scenic forest paths" },
    { icon: Coffee, title: "24/7 Tea/Coffee", desc: "Complimentary beverages anytime" }
  ];