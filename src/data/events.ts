export type ChurchEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapQuery: string;
  short: string;
  description: string[];
  schedule?: { time: string; item: string }[];
  featured?: boolean;
};

export const events: ChurchEvent[] = [
  {
    id: "newlands-church-opening",
    title: "Newlands Church Opening",
    date: "Saturday, 28 March 2026",
    time: "09:00",
    location: "Newlands SDA Church",
    address: "116 Waterval Road, Newlands, Johannesburg",
    mapQuery: "116+Waterval+Road+Newlands+Johannesburg",
    short:
      "We are overjoyed to invite the community to the grand opening of Newlands Seventh-day Adventist Church.",
    description: [
      "After years of prayer, planning, and faithful giving, Newlands SDA Church is opening the doors of our new sanctuary to the community.",
      "Join us for a day of worship, dedication, music, and fellowship as we give thanks to God for His faithfulness and ask His blessing upon the years ahead.",
      "Light refreshments will be served after the dedication service. All are warmly welcome — bring a friend.",
    ],
    schedule: [
      { time: "09:00", item: "Sabbath School & welcome" },
      { time: "11:00", item: "Dedication & divine worship" },
      { time: "13:00", item: "Fellowship lunch on the grounds" },
      { time: "15:00", item: "Music & testimonies" },
    ],
    featured: true,
  },
  {
    id: "week-of-prayer",
    title: "Week of Prayer",
    date: "5 – 12 April 2026",
    time: "18:30 nightly",
    location: "Main Sanctuary",
    address: "116 Waterval Road, Newlands, Johannesburg",
    mapQuery: "116+Waterval+Road+Newlands+Johannesburg",
    short: "A spiritual week of prayer, reflection, and renewal for the whole congregation.",
    description: [
      "Eight evenings of focused prayer, Scripture, and intercession led by our pastoral team and guest speakers.",
      "Each night centres on a theme from the life of Christ, with small-group prayer following the message.",
    ],
  },
  {
    id: "community-health-expo",
    title: "Community Health Expo",
    date: "Sunday, 17 May 2026",
    time: "09:00 – 14:00",
    location: "Church Grounds",
    address: "116 Waterval Road, Newlands, Johannesburg",
    mapQuery: "116+Waterval+Road+Newlands+Johannesburg",
    short: "Free health screenings and wellness talks open to all members of the community.",
    description: [
      "Free blood pressure, blood sugar, BMI and vision screenings provided by qualified volunteers.",
      "Talks on nutrition, stress management, and active living throughout the day. Children's activity corner available.",
    ],
  },
  {
    id: "youth-sabbath",
    title: "Youth Sabbath",
    date: "Saturday, 6 June 2026",
    time: "09:00",
    location: "Main Sanctuary",
    address: "116 Waterval Road, Newlands, Johannesburg",
    mapQuery: "116+Waterval+Road+Newlands+Johannesburg",
    short: "A Sabbath service led by our vibrant youth ministry.",
    description: [
      "Our youth lead the entire day — from Sabbath School to the sermon, music, and afternoon programme.",
      "Come encourage the next generation as they share what God is doing in their lives.",
    ],
  },
];

export const getEvent = (id: string) => events.find((e) => e.id === id);
