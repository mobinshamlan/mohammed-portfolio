import { publicUrl } from "@/lib/site";

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
  /** One short line about the contribution the certificate recognises. */
  note?: string;
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
    href: publicUrl("/certificates/moreton-bay-web-development.pdf"),
    image: {
      src: publicUrl("/images/certificates/moreton-bay-web-development.jpg"),
      width: 1800,
      height: 1271,
    },
  },
  {
    id: "02",
    name: "Developer and Technology Job Simulation",
    organisation: "Accenture / Forage",
    completed: "April 2025",
    href: publicUrl("/certificates/accenture-developer-technology.pdf"),
    image: {
      src: publicUrl("/images/certificates/accenture-developer-technology.jpg"),
      width: 1800,
      height: 1271,
    },
  },
  {
    id: "03",
    name: "Information Literacy Skills",
    organisation: "Queen Mary University of London",
    completed: null,
    href: publicUrl("/certificates/qmul-information-literacy.pdf"),
    image: {
      src: publicUrl("/images/certificates/qmul-information-literacy.jpg"),
      width: 1800,
      height: 1272,
    },
  },
  {
    id: "04",
    name: "UX/UI",
    organisation: "Satr / Tuwaiq Academy",
    completed: "February 2026",
    href: publicUrl("/certificates/satr-ux-ui.pdf"),
    image: {
      src: publicUrl("/images/certificates/satr-ux-ui.jpg"),
      width: 1800,
      height: 1271,
    },
  },
  {
    id: "05",
    name: "Volunteer Appreciation — London Saudi Club 45",
    organisation: "Eid al-Fitr 2026 · Saudi Cultural Bureau, UK",
    completed: null,
    note: "Volunteered to support and organise the club's Eid al-Fitr 2026 event, under the patronage of the Saudi Cultural Bureau in the UK.",
    href: publicUrl("/images/certificates/london-saudi-club-45-eid.jpg"),
    image: {
      src: publicUrl("/images/certificates/london-saudi-club-45-eid.jpg"),
      width: 1206,
      height: 833,
    },
  },
];
