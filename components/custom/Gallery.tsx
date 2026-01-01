import { MapVideo } from "@/app/constant";
import Typography from "../Typography";
import FloatingImageCollage from "../background/FloatingImageCollage";
import Photos from "./Photos";

export function Gallery() {
  return (
    <section
      id="gallery"
      className="relative min-h-screen bg-gradient-to-b from-[#F5EFE7] to-[#C9A177] overflow-hidden"
    >
      {/* Heading */}
      <div className="relative z-20 pt-16 sm:pt-20 lg:pt-24 text-center px-4">
        <Typography
          variant="h2"
          textColor="primary"
          weight="bold"
          align="center"
          className="mb-2"
        >
          Memories in the Making
        </Typography>
        <Typography variant="paragraph" textColor="secondary" align="center">
          Moments captured from our beautiful homestay
        </Typography>
      </div>

      {/* Space */}
      <div className="h-10 md:h-16" />

      {/* TOP ROW → Video + Collage */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-center gap-6 px-4 sm:px-6">
        {/* Map Video */}
        <div className="w-full lg:w-[35%] h-[45vh] lg:h-[60vh] rounded-2xl p-4 bg-white/40 backdrop-blur-md shadow-xl">
          <video
            src={MapVideo}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Floating Image Collage */}
        <div className="w-full lg:w-[55%] h-[45vh] lg:h-[60vh] rounded-2xl p-4 bg-white/40 backdrop-blur-md shadow-xl">
          <FloatingImageCollage />
        </div>
      </div>

      {/* SPACE BETWEEN */}
      <div className="h-10 md:h-16" />

      {/* BOTTOM ROW → PHOTOS (FULL WIDTH) */}
      <div className="relative z-20 w-full px-4 sm:px-6">
        <div className="w-full rounded-2xl p-4 bg-white/40 backdrop-blur-md shadow-xl">
          <Photos />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A177]/30 to-[#C9A177] pointer-events-none z-10" />
    </section>
  );
}

export default Gallery;
