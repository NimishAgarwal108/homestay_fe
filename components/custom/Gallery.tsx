import Typography from "../Typography";
import FloatingImageCollage from "../background/FloatingImageCollage";

export function Gallery() {
  return (
    <section
      id="gallery"
      className="relative h-screen overflow-hidden bg-gradient-to-b from-[#F5EFE7] to-[#C9A177]"
    >
      {/* Background collage */}
      <FloatingImageCollage />

      {/* Text overlay */}
      <div className="absolute top-16 md:top-24 left-1/2 -translate-x-1/2 z-20 text-center px-6">
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

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A177]/30 to-[#C9A177] pointer-events-none z-10" />
    </section>
  );
}

export default Gallery;
