import type { Metadata } from "next";
import Link from "next/link";
import "../../inner-page.css";

import InnerHero from "../../components/inner/InnerHero";
import ContentSection from "../../components/inner/ContentSection";
import TeamGrid from "../../components/inner/TeamGrid";
import CTABanner from "../../components/inner/CTABanner";
import SectionDivider from "../../components/SectionDivider";
import { links } from "../../lib/internal-links";

export const metadata: Metadata = {
  title: "Meet Our Team | Specialist Orthodontists in Oldham",
  description: "Get to know the Specialist Orthodontists and team at Oldham Orthodontics. Decades of combined experience, modern training and a warm, family-friendly approach. Book your free consultation today.",
};

const NAVY = "#1a1a3e";
const WHITE = "#fff";
const WARM = "#faf7f4";

const teamMembers = [
  {
    name: "Dr Ovais Malik",
    role: "Consultant & Specialist Orthodontist",
    gdcNumber: "81777",
    bio: "Ovais qualified as a dentist in 1996 and trained as an orthodontist at Guy's Hospital, London. He's a Consultant in Orthodontics at the University of Manchester Dental Hospital and Salford Royal NHS Foundation Trust, and is also an examiner for the MOrth RCS qualification at the Royal College of Surgeons of England.",
    fullBio:
      "Ovais Malik is a Consultant in Orthodontics at the University of Manchester Dental Hospital and Salford Royal NHS Foundation Trust. He qualified with honours as a dentist in 1996.\n\nAfter a variety of practice and hospital posts he joined the Orthodontic Postgraduate Training Programme at Guy's Hospital, London. He was awarded a Master of Science Degree in Orthodontics from the University of London and Membership in Orthodontics of both the Royal College of Surgeons of England and Edinburgh. This was followed by entry onto the Specialist list in Orthodontics of the General Dental Council in 2003.\n\nOvais was then appointed as a Senior Registrar in Orthodontics at the University of Manchester Dental Hospital and Hope Hospital, Manchester. During this time he gained the Intercollegiate Speciality Fellowship in Orthodontics of the Royal College and accreditation as a Consultant Orthodontist. He is also an examiner for the Speciality Membership in Orthodontics (MOrth RCS) at the Royal College of Surgeons of England.",
    image: "/images/team/ovais-malik.webp",
  },
  {
    name: "Dr Sarah Glossop",
    role: "Consultant & Specialist Orthodontist",
    gdcNumber: "229049",
    bio: "Sarah graduated from the University of Manchester in 2012 with the Dr Charles H. Preston prize for most outstanding dental student. She completed her specialist and Consultant training in the North West, and currently works as an Orthodontic Consultant at East Lancashire NHS Trust alongside teaching, lecturing and research.",
    fullBio:
      "Sarah graduated from the University of Manchester in 2012, receiving the prestigious Dr Charles H. Preston prize and medal for most outstanding dental student.\n\nSarah worked in general dental practice before gaining experience in a number of hospital based jobs. In 2015 Sarah began her orthodontic specialist training within the North West. She completed her training by gaining the J K Williams gold medal for the highest performing trainee sitting the Royal College of Surgeons of England Membership in Orthodontics exam that year. Simultaneously Sarah completed a Masters in Clinical Orthodontics at the University of Manchester and has published a number of orthodontic research papers.\n\nFollowing specialist training, Sarah undertook further Consultant training in Manchester which she completed in 2021. Sarah currently works as an Orthodontic Consultant at East Lancashire NHS Trust where she undertakes complex treatments as well as continuing to teach and carry out research. Sarah is a member of the British Orthodontic Society and has given lectures nationally.",
    image: "/images/team/sarah-glossop.webp",
  },
  {
    name: "Hamza Anwar",
    role: "Specialist Orthodontist",
    gdcNumber: "209661",
    bio: "Hamza graduated from the University of Liverpool in 2011 and was awarded the William Houston Gold Medal in 2016-17 for the highest performance in the Edinburgh M.Orth exam. He's accredited by Invisalign® and Incognito to provide a wide range of cosmetic orthodontic treatments, including lingual braces and invisible aligners.",
    fullBio:
      "After graduating from the University of Liverpool in 2011, Hamza gained experience in a variety of specialties working in both general practice and in various hospitals. He completed his MFDS qualification from the Royal College of Surgeons of Edinburgh in 2013.\n\nHe has since completed his specialist training in orthodontics and gained his M.Orth qualification from both the Royal College of Surgeons of Edinburgh and England. He has been awarded numerous prizes including the prestigious William Houston Gold Medal for the highest performance in the Edinburgh M.Orth examination in 2016-17. He also gained a Master of Science Degree in Clinical Orthodontics from the University of Manchester.\n\nHamza has gained accreditation from Invisalign® and Incognito to allow him to provide a wide variety of cosmetic orthodontic treatment options including lingual orthodontics and invisible aligner treatments.",
    image: "/images/team/hamza-anwar.webp",
  },
  {
    name: "Dr Nadia Stivaros",
    role: "Specialist in Orthodontics",
    gdcNumber: "75779",
    bio: "Nadia graduated in Dentistry from the University of Manchester in 1999 and went on to gain her MPhil in Orthodontics and Membership in Orthodontics from the Royal College of Surgeons of Edinburgh. She treats an extensive range of cases, NHS and private, from conventional metal braces to ceramic and Invisalign®.",
    fullBio:
      "Nadia graduated in Dentistry from the University of Manchester in 1999 where she received several awards including the dental alumni prize in dental sciences.\n\nFollowing her dental training, Nadia returned to the hospital service as a Senior House Officer to widen her postgraduate education in Oral and Maxillofacial surgery, Paediatric and Restorative dentistry. This included work at the Eastman Dental Hospital, University College London and Great Ormond Street Hospital. In 2001, she was awarded Membership of the Faculty of Dental Surgery, Royal College of Surgeons of Edinburgh.\n\nIn 2003, Nadia began an orthodontic specialist training programme and was awarded an MPhil in Orthodontics from the University of Manchester three years later. In the same year, she also gained Membership in Orthodontics from the Royal College of Surgeons of Edinburgh.\n\nNadia specialises in an extensive range of orthodontic treatments (both NHS and private), from conventional metal fixed appliances to the more aesthetic ceramic brackets and friction-free bracket systems. She is also an Invisalign® certified practitioner. Nadia has a strong research interest and has published in both national and international journals. She is on the General Dental Council Specialist list for orthodontics.",
    image: "/images/team/nadia-stivaros.webp",
  },
  {
    // DRAFT — replaces Dr Samer Salam (BugHerd #6/#7). Awaiting Rehan Alam's
    // confirmed title, GDC number and bio from the practice before this goes final.
    name: "Dr Rehan Alam",
    role: "Specialist Orthodontist",
    bio: "DRAFT - full profile to follow. Dr Rehan Alam has recently joined the specialist orthodontic team at Oldham Orthodontics.",
    image: "/images/team/rehan-alam.webp",
  },
  {
    name: "Dr Simon Watkinson",
    role: "Consultant & Specialist Orthodontist",
    gdcNumber: "103930",
    bio: "Simon graduated from Newcastle University in 2006 with merits in academic and clinical dentistry. He completed his orthodontic specialist training in Liverpool and was awarded the gold medal for the highest-performing trainee in the Royal College of Surgeons of Edinburgh Membership in Orthodontics exam that year.",
    fullBio:
      "Simon graduated from Newcastle-Upon-Tyne University in 2006 with merits in academic and clinical dentistry. He then worked in a practice specialising in aesthetic dentistry before working in a series of hospital based jobs.\n\nHe then undertook his orthodontic specialist training in Liverpool. He completed his training by gaining the gold medal for the highest performing trainee sitting the Royal College of Surgeons of Edinburgh Membership in Orthodontics exam that year. At the national conference he was also awarded the BOS cases prize for the best presented treated cases by a trainee that year. Simultaneously he completed a doctorate in dental science and published research papers.\n\nFollowing this he undertook further Consultant training in Manchester which he completed in 2015. Simon currently works as a Consultant in Orthodontics at East Lancashire NHS Trust and University of Manchester Dental Hospital where he undertakes complex treatments as well as continuing to teach and carry out research. He is a member of national orthodontic committees and has lectured nationally.",
    image: "/images/team/simon-watkinson.webp",
  },
  {
    name: "Dr Richard Needham",
    role: "Consultant & Specialist Orthodontist",
    gdcNumber: "113590",
    bio: "Richard qualified from the University of Manchester in 2007 and gained membership of both the Royal College of Surgeons of Edinburgh and England in 2009. He completed an MSc in Fixed and Removable Prosthodontics before entering a three-year specialist training programme in Orthodontics.",
    fullBio:
      "Richard qualified as a dentist in 2007 from the University of Manchester. Since then, he has worked in a variety of hospital and practice posts in all aspects of clinical dentistry. In 2009 he gained membership to both the Royal College of Surgeons of Edinburgh and the Royal College of Surgeons of England.\n\nHe completed an MSc in Fixed and Removable Prosthodontics prior to entering a three-year specialist training programme in Orthodontics. Richard completed this training in 2013, gaining entry to the General Dental Council's Orthodontic specialist list.\n\nSubsequently he undertook an additional two years of senior registrar training to achieve Consultant status. His role as a Consultant Orthodontist involves the treatment of a range of complex multi-disciplinary cases for patients with multiple missing teeth or those requiring orthognathic surgery. In addition, he teaches and supervises on both the Orthodontic postgraduate training programme and the Orthodontic Therapy course.",
    image: "/images/team/richard-needham.webp",
  },
];

export default function MeetOurTeamPage() {
  return (
    <>
      <InnerHero
        label="MEET OUR TEAM"
        title={
          <>
            The Specialist Orthodontists
            <br />
            <span>behind every smile</span>
          </>
        }
        description="Every treatment plan at Oldham Orthodontics is led by a Specialist Orthodontist - clinicians who have completed years of additional training beyond general dentistry, focused solely on straightening teeth and correcting bites. Here's the team you'll meet when you visit."
        ctaText="Arrange your free consultation"
        image="/images/about-us-hero.webp"
        imageAlt="The welcoming reception of the Oldham Orthodontics practice"
      />

      <SectionDivider from={WARM} to={WHITE} />

      <ContentSection
        label="OUR APPROACH"
        title="What is a Specialist Orthodontist?"
        paragraphs={[
          <>A Specialist Orthodontist is a fully qualified dentist who has completed at least three additional years of postgraduate training in orthodontics, and is registered on the General Dental Council&apos;s specialist list. It&apos;s the highest standard in the UK for the planning and delivery of <Link href={links.braces}>braces</Link>, <Link href={links.clearAligners}>clear aligners</Link> and combined orthodontic-surgical treatment.</>,
          "Each of our specialists brings their own training and clinical interests to the practice, which means we can plan straightforward and complex cases alike with confidence. Several members of the team also hold NHS Consultant posts at major Manchester hospitals, with academic and teaching commitments alongside their work here.",
          "Beyond the credentials, it's the way the team works with patients that defines us: calm, clear, friendly, and never rushed. You'll meet whichever Specialist Orthodontist is best suited to your case, and you'll stay with them throughout your treatment.",
        ]}
        image="/images/about-us-specialist.webp"
        imageAlt="The Specialist Orthodontist nameplates outside Oldham Orthodontics on Hollins Road"
      />

      <SectionDivider from={WHITE} to={WARM} />

      <TeamGrid
        title="Our Specialist Orthodontists"
        description="Meet the team you'll be in safe hands with - from your first free consultation through to your final smile."
        members={teamMembers}
        showCta={false}
      />

      <SectionDivider from={WARM} to={NAVY} variant="into-cta" />

      <CTABanner
        title="Ready to meet the team in person?"
        description="Book a free, no-obligation consultation with one of our Specialist Orthodontists and start your smile journey with confidence."
        ctaText="Arrange your free consultation"
      />

      <SectionDivider from={NAVY} to={WARM} variant="out-of-cta" />
    </>
  );
}
