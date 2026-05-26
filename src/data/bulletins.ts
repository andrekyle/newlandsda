// Weekly bulletin data for Newlands SDA Church.
// Each bulletin is keyed by an ISO date string (YYYY-MM-DD) representing
// the Sabbath the bulletin is for. The most recent bulletin appears first.

export type BulletinPanelMember = {
  name: string;
  role: string;
};

export type BulletinAnnouncement = {
  title: string;
  body: string[];
};

export type BulletinService = {
  name: string;
  time: string;
  deacons?: string;
  notes?: string;
};

export type Bulletin = {
  /** ISO date of the Sabbath this bulletin covers (YYYY-MM-DD). */
  date: string;
  /** Pretty date label shown in the UI, e.g. "May 23, 2026". */
  label: string;
  /** Short subtitle shown under the title and in the sidebar. */
  subtitle: string;
  panel: BulletinPanelMember[];
  announcements: BulletinAnnouncement[];
  services: BulletinService[];
  /** Optional YouTube embed URL for the mission video card. */
  missionVideo?: string;
};

export const bulletins: Bulletin[] = [
  {
    date: "2026-05-30",
    label: "May 30, 2026",
    subtitle: "Newlands SDA Church",
    panel: [
      { name: "Pastor Themba Dlamini", role: "Preacher" },
      { name: "Sibusiso Magwaza", role: "Elder on Duty" },
    ],
    announcements: [
      {
        title: "Communion Sabbath",
        body: [
          "Next Sabbath is our quarterly Communion Service. We invite every member to come prepared in heart and spirit.",
          "Foot washing will begin at 10:45, followed by the Lord's Supper during the Divine Service.",
        ],
      },
      {
        title: "Flowers",
        body: [
          "Thank you, Millie Moyo, for the beautiful flowers this week.",
          "Next week's flowers will be provided by the Dorcas Society.",
        ],
      },
      {
        title: "Church Workbee",
        body: [
          "A workbee has been scheduled for Sunday 7 June from 08:00. All hands are welcome as we prepare the grounds for winter.",
        ],
      },
    ],
    services: [
      { name: "Song Service", time: "09:00 – 09:30" },
      {
        name: "Sabbath School",
        time: "09:30 – 10:30",
        deacons: "Henrietta Makarati, Ensley Dejongh",
        notes: "Welcome: Abrielle Dietrichs and Sibusiso Magwaza",
      },
      { name: "Lesson Study", time: "10:30 – 10:55" },
      {
        name: "Divine Service",
        time: "11:00 – 12:30",
        deacons: "Henrietta Makarati, Ensley Dejongh, Rennette Mbutho",
        notes: "Welcome: Tracy Magaragada and Rowen Morden",
      },
    ],
    missionVideo: "https://www.youtube.com/embed/RJEocH_tDgU",
  },
  {
    date: "2026-05-23",
    label: "May 23, 2026",
    subtitle: "Newlands SDA Church",
    panel: [
      { name: "Leo Mlambo", role: "Preacher" },
      { name: "Sternford Nkomo", role: "Elder on Duty" },
    ],
    announcements: [
      {
        title: "Meals on Wheels – Serving Our Community",
        body: [
          "Meals on Wheels is a vital mission dedicated to helping those in need. We provide nutritious meals, clothing, bedding, and blankets (when available) to the less fortunate in our community.",
          "Your support makes a difference! Donations of food, clothing, or financial contributions are always appreciated.",
          "Bank Details — ABSA Bank · Account Name: Newlands Meals on Wheels · Account Number: 4047464598",
          "Thank you for your generosity in keeping this ministry alive.",
        ],
      },
      {
        title: "Flowers",
        body: [
          "Thank you, Rennette Mbutho, for the beautiful flowers this week.",
          "Next week's flowers will be provided by Millie Moyo.",
        ],
      },
      {
        title: "AMO Breakfast Meeting",
        body: [
          "All men are invited to a breakfast meeting on 7 June. The theme is: \"Men's health and rebuilding the family altar\".",
        ],
      },
    ],
    services: [
      { name: "Song Service", time: "09:00 – 09:30" },
      {
        name: "Sabbath School",
        time: "09:30 – 10:30",
        deacons: "Henrietta Makarati, Ensley Dejongh",
        notes: "Welcome: Abrielle Dietrichs and Sibusiso Magwaza",
      },
      { name: "Lesson Study", time: "10:30 – 10:55" },
      {
        name: "Divine Service",
        time: "11:00 – 12:30",
        deacons: "Henrietta Makarati, Ensley Dejongh, Rennette Mbutho",
        notes: "Welcome: Tracy Magaragada and Rowen Morden",
      },
    ],
    missionVideo: "https://www.youtube.com/embed/RJEocH_tDgU",
  },
];

/** Returns the bulletin matching `date` (YYYY-MM-DD) or the most recent one. */
export function getBulletin(date?: string): Bulletin {
  if (date) {
    const found = bulletins.find((b) => b.date === date);
    if (found) return found;
  }
  return bulletins[0];
}
