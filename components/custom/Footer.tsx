import { Mountain, } from "lucide-react";
import Typography from "../Typography";
const Footer = () => {
  return (
    <footer className="bg-[#0D0A1F] py-12 px-6 border-t border-[#7570BC]/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="text-[#7570BC]" size={32} />
              <Typography variant="brand" textColor="white" weight="bold">
                Master Retreat
              </Typography>
            </div>
            <Typography variant="paragraph" textColor="cream">
              Your home away from home in the mountains
            </Typography>
          </div>
          
          <div>
            <Typography variant="h4" textColor="white" weight="semibold" className="mb-4">
              Quick Links
            </Typography>
            <div className="flex flex-col gap-2">
              <a href="#home" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">Home</Typography>
              </a>
              <a href="#rooms" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">Rooms</Typography>
              </a>
              <a href="#dining" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">Dining</Typography>
              </a>
            </div>
          </div>
          
          <div>
            <Typography variant="h4" textColor="white" weight="semibold" className="mb-4">
              Services
            </Typography>
            <div className="flex flex-col gap-2">
              <a href="#amenities" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">Amenities</Typography>
              </a>
              <a href="#booking" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">Booking</Typography>
              </a>
              <a href="#contact" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">Contact</Typography>
              </a>
            </div>
          </div>
          
          <div>
            <Typography variant="h4" textColor="white" weight="semibold" className="mb-4">
              Contact
            </Typography>
            <div className="flex flex-col gap-2">
              <Typography variant="small" textColor="cream">
                +91 98765 43210
              </Typography>
              <Typography variant="small" textColor="cream">
                info@masterretreat.com
              </Typography>
              <Typography variant="small" textColor="cream">
                Manali, Himachal Pradesh
              </Typography>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#7570BC]/30 pt-8 text-center">
          <Typography variant="paragraph" textColor="cream">
            © 2024 Master Retreat. All rights reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
};
export default Footer;