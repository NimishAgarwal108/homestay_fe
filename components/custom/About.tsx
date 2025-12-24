"use client";
import URL from "@/app/constant";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Typography from "../Typography";
const About = () => {
  return (
    <section id="about" className="relative py-24 px-6 bg-gradient-to-b from-[#F5EFE7] via-[#C9A177]/20 to-[#BFC7DE] overflow-hidden">
      {/* Decorative Floating Blobs */}
      <div className="absolute top-10 left-0 w-72 h-72 md:w-96 md:h-96 bg-[#C59594]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-0 w-64 h-64 md:w-80 md:h-80 bg-[#7570BC]/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <Typography variant="h2" textColor="primary" weight="bold" align="center" className="mb-4">
            About Aamantran
          </Typography>
          <Typography variant="paragraph" textColor="secondary" align="center">
            A Boutique Homestay in the serene mountains of Uttarakhand
          </Typography>
        </div>

        {/* Card */}
        <Card className="bg-white/80 backdrop-blur-md border-2 border-[#BFC7DE] shadow-xl p-6 md:p-12 flex flex-col md:flex-row items-center gap-8">
          {/* Image / Icon */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
           <div className="flex items-center gap-2">
          <Image
            src={URL.LOGO}
            alt="Homestay Logo"
            width={200}
            height={200}
            priority
          />
          
        </div>
          </div>

          {/* Text Content */}
          <CardContent className="flex-1">
            <Typography variant="h3" textColor="primary" weight="bold" className="mb-4">
              A Boutique Experience in the Heart of Nature
            </Typography>
            <Typography variant="paragraph" textColor="secondary" className="mb-4">
              Welcome to <span className="font-semibold text-[#7570BC]">Aamantran – A Boutique Homestay</span>, opening in 2026. Nestled in the breathtaking mountains of Rudraprayag, Uttarakhand, India, our homestay offers a tranquil retreat surrounded by nature's splendor.
            </Typography>
            <Typography variant="paragraph" textColor="secondary" className="mb-6">
              Experience comfort, serenity, and a perfect blend of modern amenities with traditional Himalayan hospitality. Whether you seek relaxation, yoga, or a memorable family getaway, Aamantran is your perfect escape.
            </Typography>
            
            <Button className="bg-[#7570BC] text-white hover:bg-[#C59594] transition-all px-6 py-3 mt-2">
              Explore More
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default About;
