import URL from "@/constants";
import Image from "next/image";
import Link from "next/link";
import Typography from "@/components/layout/Typography";

const Footer = () => {
  return (
    <footer className="bg-[#0D0A1F] py-10 sm:py-12 px-4 sm:px-6 border-t border-[#7570BC]/30">
      <div className="max-w-9xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Image
                src={URL.LOGO}
                alt="Homestay Name"
                width={60}
                height={60}
                priority
              />
              <Typography variant="brand" textColor="white" weight="bold">
                A Boutique Homestay
              </Typography>
            </div>

            <Typography
              variant="paragraph"
              textColor="cream"
              className="mt-3 sm:ml-20"
            >
              Your home away from home in the mountains
            </Typography>
          </div>

          <div className="text-center sm:text-left">
            <Typography
              variant="h4"
              textColor="white"
              weight="semibold"
              className="mb-4"
            >
              Quick Links
            </Typography>
            <div className="flex flex-col gap-2">
              <Link href="#home" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">
                  Home
                </Typography>
              </Link>
              <Link href="#rooms" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">
                  Rooms
                </Typography>
              </Link>
              <Link href="#dining" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">
                  Dining
                </Typography>
              </Link>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <Typography
              variant="h4"
              textColor="white"
              weight="semibold"
              className="mb-4"
            >
              Services
            </Typography>
            <div className="flex flex-col gap-2">
              <Link href="#amenities" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">
                  Amenities
                </Typography>
              </Link>
              <Link href="#booking" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">
                  Booking
                </Typography>
              </Link>
              <Link href="#contact" className="hover:text-[#7570BC]">
                <Typography variant="paragraph" textColor="cream">
                  Contact
                </Typography>
              </Link>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <Typography
              variant="h4"
              textColor="white"
              weight="semibold"
              className="mb-4"
            >
              Contact
            </Typography>
            <div className="flex flex-col gap-2">
              <a href={`tel:${URL.PHOME_NO}`}>
                <Typography
                  variant="paragraph"
                  textColor="accent"
                  className="hover:text-[#C59594]"
                >
                  {URL.PHOME_NO}
                </Typography>
              </a>
              <a href={`mailto:${URL.EMAIL}`}>
                <Typography
                  variant="paragraph"
                  textColor="accent"
                  className="hover:text-[#C59594]"
                >
                  {URL.EMAIL}
                </Typography>
              </a>
              <a href="https://maps.app.goo.gl/mkhhYnEW3iSfwchG6">
                <Typography
                  variant="paragraph"
                  textColor="accent"
                  className="hover:text-[#C59594]"
                >
                  {URL.LOCATION}
                </Typography>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#7570BC]/30 pt-6 sm:pt-8 text-center">
          <Typography variant="paragraph" textColor="cream">
            © 2026 Aamantaran a Boutique Homestay. All rights reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

