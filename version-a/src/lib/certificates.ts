export type CertificateImage = {
  src: string;
  width: number;
  height: number;
};

export type Certificate = {
  id: string;
  name: string;
  organisation: string;
  completed: string | null;
  /** The original PDF. */
  href: string | null;
  /** A page-one preview rendered from the PDF. Leave null for text-only entries. */
  image: CertificateImage | null;
};

export const certificates: Certificate[] = [
  {
    id: "01",
    name: "Entrepreneurship & Innovation: Web Development Job Simulation",
    organisation: "Moreton Bay Regional Council / Forage",
    completed: "April 2024",
    href: "/certificates/moreton-bay-web-development.pdf",
    image: {
      src: "/images/certificates/moreton-bay-web-development.jpg",
      width: 1800,
      height: 1271,
    },
  },
  {
    id: "02",
    name: "Developer and Technology Job Simulation",
    organisation: "Accenture / Forage",
    completed: "April 2025",
    href: "/certificates/accenture-developer-technology.pdf",
    image: {
      src: "/images/certificates/accenture-developer-technology.jpg",
      width: 1800,
      height: 1271,
    },
  },
  {
    id: "03",
    name: "Information Literacy Skills",
    organisation: "Queen Mary University of London",
    completed: null,
    href: "/certificates/qmul-information-literacy.pdf",
    image: {
      src: "/images/certificates/qmul-information-literacy.jpg",
      width: 1800,
      height: 1272,
    },
  },
  {
    id: "04",
    name: "UX/UI",
    organisation: "Satr / Tuwaiq Academy",
    completed: "February 2026",
    href: "/certificates/satr-ux-ui.pdf",
    image: {
      src: "/images/certificates/satr-ux-ui.jpg",
      width: 1800,
      height: 1271,
    },
  },
];
