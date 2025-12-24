import { MapVideo } from "@/app/constant";
import Typography from "../Typography";
import FloatingImageCollage from "../background/FloatingImageCollage";

export function Gallery() {
  return (
    <section
      id="gallery"
      className="relative min-h-screen lg:h-screen bg-gradient-to-b from-[#F5EFE7] to-[#C9A177] overflow-hidden"
    >
      {/* Heading */}
      <div className="relative z-20 pt-16 sm:pt-20 lg:pt-24 text-center px-4 sm:px-6">
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

      {/* GAP between heading & collage */}
      <div className="h-6 sm:h-10 md:h-20" />

      {/* Responsive container */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-center gap-6 px-4 sm:px-6">
        <div className="w-full sm:w-[70%] md:w-[50%] lg:w-[30%] h-[40vh] sm:h-[50vh] lg:h-[60vh] border-0.1 border-[#7570BC] rounded-2xl p-4 bg-white/40 backdrop-blur-md shadow-xl lg:mr-10">
          <video
            src={MapVideo}
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[50%] h-[40vh] sm:h-[50vh] lg:h-[60vh] border-0.1 border-[#7570BC] rounded-2xl p-4 bg-white/40 backdrop-blur-md shadow-xl">
          <FloatingImageCollage />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A177]/30 to-[#C9A177] pointer-events-none z-10" />
    </section>
  );
}

export default Gallery;
