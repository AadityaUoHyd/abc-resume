import TEMPLATE_ONE_IMG from '../assets/template-one.png'
import TEMPLATE_TWO_IMG from '../assets/template-two.png'
import TEMPLATE_THREE_IMG from '../assets/template-three.png'

export const resumeTemplates = [
  {
    id:'01',
    thumbnailImg: TEMPLATE_ONE_IMG,
    colorPaletteCode: 'themeOne',
    isPremium: false
  },
  {
    id:'02',
    thumbnailImg: TEMPLATE_TWO_IMG,
    colorPaletteCode: 'themeTwo',
    isPremium: true
  },
  {
    id:'03',
    thumbnailImg: TEMPLATE_THREE_IMG,
    colorPaletteCode: 'themeThree',
    isPremium: true
  }
]

export const themeColorPalette = {
  themeOne: [
    ["#EBFDFF", "#A1F4FD", "#CEFAFE", "#00B8DB", "#4A5565"],

    ["#E9FBF8", "#B4EFE7", "#93E2DA", "#2AC9A0", "#3D4C5A"],
    ["#F5F4FF", "#E0DBFF", "#C9C2F8", "#8579D1", "#4B4B5C"],
    ["#F0FAFF", "#D6F0FF", "#AFDEFF", "#3399FF", "#445361"],
    ["#FFF5F7", "#FFE0EC", "#FAC6D4", "#F6729C", "#5A5A5A"],
    ["#F9FAFB", "#E4E7EB", "#CBD5E0", "#7F9CF5", "#2D3748"],

    ["#F4FFFD", "#D3FDF2", "#B0E9D4", "#34C79D", "#384C48"],
    ["#FFF7F0", "#FFE6D9", "#FFD2BA", "#FF9561", "#4C4743"],
    ["#F9FCFF", "#E3F0F9", "#C0DDEE", "#6CA6CF", "#46545E"],
    ["#FFFDF6", "#FFF4D7", "#FFE7A0", "#FFD000", "#57534E"],
    ["#EFFCFF", "#C8F0FF", "#99E0FF", "#007BA7", "#2B3A42"],

    ["#F7F7F7", "#E4E4E4", "#CFCFCF", "#4A4A4A", "#222222"],
    ["#E3F2FD", "#90CAF9", "#a8d2f4", "#1E88E5", "#0D47A1"],
  ],
  themeTwo: [
    ["#E9FBF8", "#B4EFE7", "#93E2DA", "#2AC9A0", "#3D4C5A"],
    ["#F5F4FF", "#E0DBFF", "#C9C2F8", "#8579D1", "#4B4B5C"],
    ["#F0FAFF", "#D6F0FF", "#AFDEFF", "#3399FF", "#445361"],
    ["#FFF5F7", "#FFE0EC", "#FAC6D4", "#F6729C", "#5A5A5A"],
    ["#F9FAFB", "#E4E7EB", "#CBD5E0", "#7F9CF5", "#2D3748"],
    ["#F4FFFD", "#D3FDF2", "#B0E9D4", "#34C79D", "#384C48"],
    ["#FFF7F0", "#FFE6D9", "#FFD2BA", "#FF9561", "#4C4743"],
    ["#F9FCFF", "#E3F0F9", "#C0DDEE", "#6CA6CF", "#46545E"],
    ["#FFFDF6", "#FFF4D7", "#FFE7A0", "#FFD000", "#57534E"],
    ["#EFFCFF", "#C8F0FF", "#99E0FF", "#007BA7", "#2B3A42"],
    ["#F7F7F7", "#E4E4E4", "#CFCFCF", "#4A4A4A", "#222222"],
    ["#E3F2FD", "#90CAF9", "#a8d2f4", "#1E88E5", "#0D47A1"],
  ],
  themeThree: [
    ["#F5F4FF", "#E0DBFF", "#C9C2F8", "#8579D1", "#4B4B5C"],
    ["#F0FAFF", "#D6F0FF", "#AFDEFF", "#3399FF", "#445361"],
    ["#FFF5F7", "#FFE0EC", "#FAC6D4", "#F6729C", "#5A5A5A"],
    ["#F9FAFB", "#E4E7EB", "#CBD5E0", "#7F9CF5", "#2D3748"],
    ["#F4FFFD", "#D3FDF2", "#B0E9D4", "#34C79D", "#384C48"],
    ["#FFF7F0", "#FFE6D9", "#FFD2BA", "#FF9561", "#4C4743"],
    ["#F9FCFF", "#E3F0F9", "#C0DDEE", "#6CA6CF", "#46545E"],
    ["#FFFDF6", "#FFF4D7", "#FFE7A0", "#FFD000", "#57534E"],
    ["#EFFCFF", "#C8F0FF", "#99E0FF", "#007BA7", "#2B3A42"],
    ["#F7F7F7", "#E4E4E4", "#CFCFCF", "#4A4A4A", "#222222"],
    ["#E3F2FD", "#90CAF9", "#a8d2f4", "#1E88E5", "#0D47A1"],
    ["#E9FBF8", "#B4EFE7", "#93E2DA", "#2AC9A0", "#3D4C5A"],
  ]
};

export const DUMMY_RESUME_DATA = {
  profileInfo: {
    profilePreviewUrl: "https://avatars.githubusercontent.com/u/57300089",
    fullName: "Aaditya Raj",
    designation: "Full Stack Software Engineer",
    summary:
      "Innovative and detail-oriented software engineer with 2+ years of experience delivering high-performance web applications using cutting-edge technologies such as Java, Spring Boot, SQL/NoSQL Databases, Microservices, React, Python, MERN, Next.Js, DevOps and AWS.",
  },
  contactInfo: {
    email: "aadi@gmail.com",
    phone: "+91 9999999999",
    location:'Hyderabad, India',
    linkedin: "https://www.linkedin.com/in/aaditya-bachchu-chatterjee-0485933b/",
    github: "https://github.com/AadityaUoHyd",
    website: "https://abchatterjee.netlify.app/",
  },
  workExperience: [
    {
      company: "Magnaquest Technologies",
      role: "Software Engineer",
      startDate: "2023-10",
      endDate: "2024-11",
      description:
        "Worked as software developer at Magnaquest Technologies. Involved in development, and testing of web applications using Java, Spring Boot, Microservices, and Databases.",
    },
    {
      company: "Infosys",
      role: "Full Stack Software Engineer",
      startDate: "2024-12",
      endDate: "2025-12",
      description:
        "Worked on full stack development of Magnaquest Technologies. Involved in design, development, and testing of web applications using Java, Spring Boot, Microservices, React, Python, MERN, Next.Js, DevOps and AWS.",
    },
  ],
  education: [
    {
      degree: "Masters in Computer Science",
      institution: "University of Hyderabad",
      startDate: "2011-07",
      endDate: "2014-06",
    },
    {
      degree: "Bachelors in Computer Science",
      institution: "Ranchi University",
      startDate: "2008-08",
      endDate: "2011-06",
    },
    {
      degree: "Intermediate in Science",
      institution: "BSK College",
      startDate: "2010-06",
      endDate: "2008-05",
    },
  ],
  skills: [
    { name: "Java", progress: 85 },
    { name: "React", progress: 90 },
    { name: "SQL", progress: 75 },
    { name: "Spring Boot", progress: 80 },
    { name: "AWS", progress: 75 },
    { name: "MERN", progress: 70 },
  ],
  projects: [
    {
      title: "ABC Evantra",
      description:
        "ABC-Evantra is a modern event ticketing platform that allows organizers to create events, sell tickets, and analyze performance, while attendees can browse and purchase tickets securely, staff can verify attendee's tickets during event with mobile via QR code.",
      github: "https://github.com/AadityaUoHyd/abc-evantra",
      liveDemo: "https://abc-evantra.vercel.app/",
    },
    {
      title: "The Platenet",
      description:
        "A full-stack online food ordering web application, 'The-PlateNet' is build in Java & React. This repository contain frontend code.",
      github: "https://github.com/AadityaUoHyd/the-platenet",
      liveDemo: "https://the-platenet.vercel.app/",
    },
  ],
  certifications: [
    {
      title: "Hitachi Soft Skills Certification",
      issuer: "Hitachi",
      year: "2014",
    },
    {
      title: "AWS Solutions Architect",
      issuer: "AWS",
      year: "2021",
    },
  ],
  languages: [
    { name: "English", progress: 90 },
    { name: "Hindi", progress: 90 },
    { name: "Bengali", progress: 70 },
  ],
  interests: ["Books", "Cricket", "Movies", "Traveling"],
};