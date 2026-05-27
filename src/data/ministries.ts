import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Users,
  Heart,
  Radio,
  HomeIcon,
  HeartHandshake,
  Compass,
  Crown,
  Coins,
  Flower,
  Sparkles,
  Star,
  GraduationCap,
  HandHeart,
} from "lucide-react";
import adventurersBanner from "@/assets/adventurers.jpg";
import communicationBanner from "@/assets/communication.jpg";
import familyLifeBanner from "@/assets/family-life.jpg";
import healthBanner from "@/assets/health.jpg";
import mensMinistryBanner from "@/assets/mens-ministry.jpg";
import pathfindersBanner from "@/assets/pathfinders.jpg";
import personalMinistryBanner from "@/assets/personal-ministry.jpg";
import sabbathSchoolBanner from "@/assets/sabbath-school.jpg";
import stewardshipBanner from "@/assets/stewardship.jpg";
import treasuryBanner from "@/assets/treasury.jpg";
import voiceOfProphecyBanner from "@/assets/voiceOfProphecy.jpg";
import welfareBanner from "@/assets/welfare.jpg";
import womensMinistriesBanner from "@/assets/womens-ministries.jpg";
import youthBanner from "@/assets/youth.jpg";

export type Ministry = {
  id: string;
  title: string;
  tagline: string;
  /** Short blurb shown on the listing card. */
  short: string;
  /** Lucide icon used in the hero banner & card. */
  icon: LucideIcon;
  /** Tailwind gradient classes for the hero (background only). */
  gradient: string;
  leader: string;
  meets: string;
  location: string;
  /** Long-form description paragraphs for the detail page. */
  description: string[];
  /** Bullet list of activities / focus areas. */
  activities: string[];
  /** Optional pre-designed banner image for the detail-page hero. */
  bannerImage?: string;
};

export const ministries: Ministry[] = [
  {
    id: "adventurers",
    title: "Adventurers",
    tagline: "A fun, Christ-centred club for children ages 4–9.",
    short:
      "A Christ-centred club for children ages 4–9 — helping little ones grow in Jesus through learning, play, and adventure.",
    icon: Star,
    gradient: "from-sky-600 to-indigo-800",
    leader: "Adventurer Director",
    meets: "Sabbath afternoons",
    location: "Adventurer room",
    description: [
      "The Adventurer Club of Newlands SDA is a Christ-centred ministry for children ages 4–9 and their parents.",
      "Through age-appropriate Bible lessons, crafts, awards, songs, games and outdoor activities, our Adventurers learn to love Jesus, care for their families, and discover God's world.",
      "Parents are welcomed alongside their children — making Adventurers a place where the whole family grows together in faith.",
    ],
    activities: [
      "Weekly club meetings",
      "Awards & adventure badges",
      "Family fun days & outings",
      "Children's Sabbath programs",
    ],
    bannerImage: adventurersBanner,
  },
  {
    id: "communication",
    title: "Communication",
    tagline: "Sharing the message of hope and salvation.",
    short:
      "Sharing the message of hope, truth, and salvation through effective and Christ-honouring communication.",
    icon: Radio,
    gradient: "from-emerald-700 to-teal-900",
    leader: "Communication Director",
    meets: "Monthly planning · 1st Sunday",
    location: "Media room",
    description: [
      "The Communication Department of Newlands SDA is dedicated to sharing the message of hope, truth, and salvation through effective and Christ-honouring communication.",
      "We tell the story of what God is doing in our church — through the website, social media, livestreams of services, the weekly bulletin, and printed materials.",
      "We also help every other ministry communicate clearly with the congregation and the wider community.",
    ],
    activities: [
      "Website & social-media content",
      "Livestream & video production",
      "Weekly bulletin & event posters",
      "Press releases & public relations",
    ],
    bannerImage: communicationBanner,
  },
  {
    id: "family-life",
    title: "Family Life Ministry",
    tagline: "Strengthening families through Christ-centred guidance.",
    short:
      "Strengthening families through Christ-centered guidance, support, and fellowship.",
    icon: HomeIcon,
    gradient: "from-rose-700 to-pink-900",
    leader: "Family Life Director",
    meets: "Quarterly workshops",
    location: "Fellowship hall",
    description: [
      "The Family Life Ministry of Newlands SDA is dedicated to strengthening families through Christ-centred guidance, support, and fellowship.",
      "We affirm that the family is God's first institution — and we walk with couples, parents, single members, and the bereaved through every season of life.",
      "Through marriage seminars, parenting workshops, and small-group fellowship, we help families grow stronger together in Christ.",
    ],
    activities: [
      "Marriage enrichment weekends",
      "Parenting workshops",
      "Pre-marital counselling support",
      "Family-night fellowship dinners",
    ],
    bannerImage: familyLifeBanner,
  },
  {
    id: "health",
    title: "Health Ministry",
    tagline: "Wholistic health — body, mind, and spirit.",
    short:
      "Promoting wholeness by nurturing the physical, mental, and spiritual well-being of individuals and families.",
    icon: Heart,
    gradient: "from-sky-700 to-blue-900",
    leader: "Health Ministry Director",
    meets: "Quarterly expos",
    location: "Church grounds",
    description: [
      "The Health Ministry of Newlands SDA is committed to promoting wholeness by nurturing the physical, mental, and spiritual well-being of individuals and families.",
      "Following the Adventist health message, we run free community health expos, cooking classes, and lifestyle programs that share the gospel through practical care.",
      "We partner with local clinics and health professionals so that everyone in our community has access to the tools they need to thrive.",
    ],
    activities: [
      "Community health expos & free screenings",
      "Plant-based cooking demonstrations",
      "Stop-smoking & lifestyle programs",
      "Mental-health & stress-relief evenings",
    ],
    bannerImage: healthBanner,
  },
  {
    id: "mens-ministry",
    title: "Men's Ministry",
    tagline: "Men growing together as disciples of Jesus.",
    short:
      "Promoting wholeness by nurturing the physical, mental, and spiritual well-being of individuals and families.",
    icon: Users,
    gradient: "from-slate-700 to-slate-900",
    leader: "Men's Ministry Director",
    meets: "Saturdays · monthly breakfast",
    location: "Fellowship hall",
    description: [
      "The Men's Ministry of Newlands SDA is committed to nurturing men as godly husbands, fathers, leaders, and disciples of Jesus Christ.",
      "We provide a place where men can pray together, study the Word, encourage one another, and serve the church and community side-by-side.",
      "Regular breakfasts, retreats, and service projects build authentic friendships rooted in Christ.",
    ],
    activities: [
      "Monthly men's prayer breakfast",
      "Annual men's retreat",
      "Bible-study small groups",
      "Community service projects",
    ],
    bannerImage: mensMinistryBanner,
  },
  {
    id: "pathfinders",
    title: "Pathfinders",
    tagline: "A worldwide, Bible-based youth organisation for ages 10–15.",
    short:
      "A worldwide, Bible-based youth organization sponsored by the Seventh-day Adventist Church, open to all young people ages 10–15.",
    icon: Compass,
    gradient: "from-amber-700 to-orange-900",
    leader: "Pathfinder Director",
    meets: "Saturday afternoons",
    location: "Pathfinder hall",
    description: [
      "Pathfinders is a worldwide, Bible-based youth organisation sponsored by the Seventh-day Adventist Church, open to all young people ages 10–15.",
      "Through marching, drilling, camping, honours and Bible study, Pathfinders learn discipline, leadership, and a love for God and His creation.",
      "Our club welcomes children from any background — uniforms, materials, and mentoring are provided.",
    ],
    activities: [
      "Weekly club meetings",
      "Honours & skill awards",
      "Camporees and outdoor adventures",
      "Community service & outreach",
    ],
    bannerImage: pathfindersBanner,
  },
  {
    id: "personal-ministry",
    title: "Personal Ministry",
    tagline: "Every member a witness for Jesus.",
    short:
      "Equipping and inspiring every member to actively participate in sharing the gospel.",
    icon: HeartHandshake,
    gradient: "from-fuchsia-700 to-pink-900",
    leader: "Personal Ministries Director",
    meets: "Sabbath afternoons · monthly",
    location: "Sanctuary",
    description: [
      "The Personal Ministries Department of Newlands SDA is dedicated to equipping and inspiring every member to actively participate in sharing the gospel.",
      "We train members to give Bible studies, lead small groups, distribute literature, and witness in their everyday relationships.",
      "Our heart is for a church where every member is a missionary in their home, workplace, and neighbourhood.",
    ],
    activities: [
      "Bible-study training & resources",
      "Literature & outreach materials",
      "Small-group leadership training",
      "Community evangelism campaigns",
    ],
    bannerImage: personalMinistryBanner,
  },
  {
    id: "sabbath-school",
    title: "Sabbath School",
    tagline: "Bible study and fellowship every Sabbath.",
    short:
      "The heart of spiritual learning and fellowship within our Seventh-day Adventist Church.",
    icon: BookOpen,
    gradient: "from-yellow-700 to-amber-900",
    leader: "Sabbath School Superintendent",
    meets: "Saturdays · 09:30",
    location: "Main sanctuary & classrooms",
    description: [
      "Sabbath School is the heart of spiritual learning and fellowship within Newlands SDA Church.",
      "Through small-group classes for every age, we study Scripture together each week using the quarterly lesson — discussing, applying, and praying for one another.",
      "From the youngest child in Cradle Roll to the most seasoned adult class, every member has a place to grow in God's Word.",
    ],
    activities: [
      "Adult lesson study in the sanctuary",
      "Youth class for ages 13–18",
      "Children's divisions (Beginner, Kindergarten, Primary, Juniors)",
      "Mission story & global focus each Sabbath",
    ],
    bannerImage: sabbathSchoolBanner,
  },
  {
    id: "stewardship",
    title: "Stewardship",
    tagline: "Faithful management of all that God has entrusted to us.",
    short:
      "Encouraging faithful and responsible management of all that God has entrusted to His people.",
    icon: Crown,
    gradient: "from-purple-700 to-violet-900",
    leader: "Stewardship Director",
    meets: "Quarterly seminars",
    location: "Sanctuary",
    description: [
      "The Stewardship Ministry of Newlands SDA encourages faithful and responsible management of all that God has entrusted to His people — our time, talents, treasure, body, and the environment.",
      "Stewardship is not only about giving — it is about a whole-life response to God's grace.",
      "Through seminars, sermons, and resources we help members live as joyful and intentional stewards of every blessing.",
    ],
    activities: [
      "Stewardship seminars & sermons",
      "Personal-finance & budgeting workshops",
      "Tithe & offering education",
      "Time & talent inventories for service",
    ],
    bannerImage: stewardshipBanner,
  },
  {
    id: "treasury",
    title: "Treasury",
    tagline: "Stewarding the church's resources with integrity.",
    short:
      "Entrusted with the faithful management of the church's financial resources in support of its mission and ministry.",
    icon: Coins,
    gradient: "from-emerald-700 to-green-900",
    leader: "Church Treasurer",
    meets: "After each service",
    location: "Treasury office",
    description: [
      "The Treasury Department of Newlands SDA is entrusted with the faithful management of the church's financial resources in support of its mission and ministry.",
      "We receive tithes and offerings, remit them according to denominational policy, and ensure every rand given is accounted for transparently.",
      "Our treasurers serve quietly behind the scenes so that every other ministry can flourish.",
    ],
    activities: [
      "Receipt & remittance of tithes and offerings",
      "Monthly financial reports",
      "Annual audit & board reporting",
      "Donor records & receipts",
    ],
    bannerImage: treasuryBanner,
  },
  {
    id: "voice-of-prophecy",
    title: "Voice of Prophecy",
    tagline: "Free Bible school — sharing Christ one lesson at a time.",
    short:
      "A free Bible school ministry partnering with the Voice of Prophecy Bible School in Claremont — our members lead Bible studies with church family and the wider community.",
    icon: GraduationCap,
    gradient: "from-blue-700 to-indigo-900",
    leader: "Voice of Prophecy Coordinator",
    meets: "Weekly Bible-study groups · ongoing enrolment",
    location: "In homes, online & on church grounds",
    description: [
      "The Voice of Prophecy (VOP) is one of the longest-running media and Bible-school ministries of the Seventh-day Adventist Church — sharing the gospel through radio, television and free Bible correspondence courses since 1929.",
      "In Southern Africa, the Voice of Prophecy Bible School operates from its main campus in Claremont, Cape Town, where lessons are produced, dispatched and marked, and where qualified instructors guide thousands of students through Scripture every year.",
      "At Newlands SDA we run a local VOP branch: trained members enrol church family and community contacts in the free Discover Bible School courses, walk with each student week-by-week, mark their lessons, pray with them, and introduce them to the fellowship of the church.",
      "Whether you are a long-time member wanting to grow deeper in the Word, or a friend curious about what the Bible really teaches, every lesson is free and there is no obligation — only an open Bible and an open heart.",
    ],
    activities: [
      "Free Discover / Voice of Prophecy Bible-study courses",
      "One-to-one Bible studies with community contacts",
      "Lesson marking, prayer & personal follow-up",
      "Bridge-events from Bible study to baptism & church family",
    ],
    bannerImage: voiceOfProphecyBanner,
  },
  {
    id: "welfare",
    title: "Welfare",
    tagline: "Serving Newlands and surrounding communities in the name of Jesus.",
    short:
      "Adventist Community Services in action — home visits, soup kitchens, food parcels and prayer with our neighbours across Newlands, Johannesburg and surrounding communities.",
    icon: HandHeart,
    gradient: "from-amber-700 to-red-900",
    leader: "Welfare / Community Services Director",
    meets: "Weekly outreach · monthly planning",
    location: "Church grounds & in the community",
    description: [
      "The Welfare Ministry of Newlands SDA — part of the worldwide Adventist Community Services / Dorcas tradition — exists to meet the physical, emotional and spiritual needs of our neighbours with Christ-like compassion.",
      "We serve Newlands in Johannesburg and the surrounding communities through regular house visits to the sick, elderly, bereaved and shut-in; through a soup kitchen and food-parcel distribution; and through clothing drives and practical help wherever it is needed.",
      "At the heart of every act of service is prayer — we pray with and for the families we visit, knowing that real change begins when needs are met in Jesus' name.",
      "Every member is welcome to serve. Whether you can cook, drive, visit, donate or pray, there is a place for you on the welfare team.",
    ],
    activities: [
      "Soup kitchen & weekly hot meals",
      "Food-parcel & grocery distribution",
      "Home visits — sick, elderly, bereaved & shut-in",
      "Clothing, blanket & winter drives",
      "Prayer with and for our community",
    ],
    bannerImage: welfareBanner,
  },
  {
    id: "womens-ministries",
    title: "Women's Ministries",
    tagline: "A Christ-centred community for the women of our church.",
    short:
      "A Christ-centered community dedicated to nurturing, empowering, and equipping women for spiritual growth.",
    icon: Flower,
    gradient: "from-pink-700 to-rose-900",
    leader: "Women's Ministries Director",
    meets: "Monthly fellowship",
    location: "Fellowship hall",
    description: [
      "The Women's Ministry of Newlands SDA is a Christ-centred community dedicated to nurturing, empowering, and equipping women for spiritual growth.",
      "Through prayer, Bible study, mentorship, and fellowship, women of every age and stage of life encourage one another to walk closely with Jesus.",
      "We celebrate the unique calling of women in the church, the home, and the world — and stand together through every season.",
    ],
    activities: [
      "Monthly women's fellowship",
      "Annual women's retreat",
      "Mentorship & prayer partners",
      "Community outreach projects",
    ],
    bannerImage: womensMinistriesBanner,
  },
  {
    id: "youth",
    title: "Youth Ministry",
    tagline: "Empowering young people to live boldly for Christ.",
    short:
      "A vibrant and dynamic ministry dedicated to nurturing the spiritual growth of many young people.",
    icon: Sparkles,
    gradient: "from-indigo-700 to-blue-900",
    leader: "Youth Ministry Director",
    meets: "Fridays · 18:00 (AY vespers)",
    location: "Youth hall",
    description: [
      "The Youth Department of Newlands SDA is a vibrant and dynamic ministry dedicated to nurturing the spiritual growth of young people.",
      "From AY vespers on Friday nights to outreach trips, camps, and Senior Youth gatherings — we walk with teens and young adults as they discover Jesus and their calling.",
      "Expect lively worship, honest conversation, deep friendships, and real community.",
    ],
    activities: [
      "Friday-night AY (Adventist Youth) vespers",
      "Annual youth camp & outreach trips",
      "Ambassador & Senior Youth groups",
      "Youth Sabbath services",
    ],
    bannerImage: youthBanner,
  },
];

export function getMinistry(id: string): Ministry | undefined {
  return ministries.find((m) => m.id === id);
}
