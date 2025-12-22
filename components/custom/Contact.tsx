import URL from '@/app/constant';
import { Mail, MapPin, Phone } from 'lucide-react';
import Typography from "../Typography";
const Contact = () => {
  return (
    <section id="contact" className="py-24 px-6 bg-[#BFC7DE]">
      <div className="max-w-4xl mx-auto text-center">
        <Typography variant="h2" textColor="primary" weight="bold" align="center" className="mb-8">
          Get In Touch
        </Typography>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <Phone className="text-[#7570BC] mx-auto mb-4" size={32} />
            <Typography variant="h4" textColor="primary" weight="semibold" align="center" className="mb-2">
              Phone
            </Typography>
            <a href={`tel:${URL.PHOME_NO}`}>
              <Typography variant="paragraph" textColor="accent" align="center" className="hover:text-[#C59594]">
                {URL.PHOME_NO}
              </Typography>
            </a>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <Mail className="text-[#7570BC] mx-auto mb-4" size={32} />
            <Typography variant="h4" textColor="primary" weight="semibold" align="center" className="mb-2">
              Email
            </Typography>
            <a href="mailto:info@masterretreat.com">
              <Typography variant="paragraph" textColor="accent" align="center" className="hover:text-[#C59594]">
                {URL.EMAIL}
              </Typography>
            </a>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <MapPin className="text-[#7570BC] mx-auto mb-4" size={32} />
            <Typography variant="h4" textColor="primary" weight="semibold" align="center" className="mb-2">
              Location
            </Typography>
            <Typography variant="paragraph" textColor="secondary" align="center">
             {URL.LOCATION}
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Contact;