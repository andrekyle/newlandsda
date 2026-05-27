/**
 * Per-ministry deep content for the ministry detail pages.
 * Seeded from research on official SDA sources; admins can edit/extend
 * every field at runtime via the EditableList controls on each page.
 *
 * Each entry contributes:
 *  - team:        leadership profiles (>= 3 default slots per ministry)
 *  - events:      upcoming or recurring ministry events
 *  - fundraising: ministry-specific giving / project drives
 */

export type MinistryTeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  email: string;
  phone: string;
  whatsapp: string;
};

export type MinistryEvent = {
  name: string;
  date: string; // free-form date / month / "ongoing"
  description: string;
};

export type MinistryFundraiser = {
  title: string;
  description: string;
  goal: string; // optional free-form goal, e.g. "R 12,000"
};

export type MinistryDetail = {
  team: MinistryTeamMember[];
  events: MinistryEvent[];
  fundraising: MinistryFundraiser[];
};

const blankPerson = (role: string): MinistryTeamMember => ({
  name: "Add name",
  role,
  bio: "Add a short bio here.",
  image: "",
  email: "",
  phone: "",
  whatsapp: "",
});

export const ministryDetails: Record<string, MinistryDetail> = {
  adventurers: {
    team: [
      { ...blankPerson("Adventurer Director"), bio: "Oversees all club operations, builds the leadership team, and ensures safe and Christ-centred programming for our 4-9 year olds." },
      { ...blankPerson("Secretary / Treasurer"), bio: "Maintains membership records, tracks awards earned, and manages club finances for resources, uniforms and outings." },
      { ...blankPerson("Instructor / Counsellor"), bio: "Teaches curriculum requirements, leads activity groups, presents Bible lessons and mentors each child." },
    ],
    events: [
      { name: "Investiture Service", date: "Ongoing (per level)", description: "Children receive class pins and insignia in a formal church recognition of completed Adventurer level requirements." },
      { name: "World Adventurer Day", date: "May", description: "Annual celebration uniting Adventurers globally with themed Sabbath activities, crafts and family programming." },
      { name: "Adventurer Family Network", date: "Monthly", description: "Family-focused gatherings featuring games, Bible activities, shared meals and parent-child bonding." },
    ],
    fundraising: [
      { title: "Adventurer Uniform Fund", description: "Sponsor official Adventurer dress and insignia for families who need help with the costs.", goal: "" },
      { title: "Camp & Retreat Scholarships", description: "Help send every Adventurer to summer camp and conference events, regardless of family income.", goal: "" },
      { title: "Community Outreach Projects", description: "Fund Ingathering and food-basket distribution that supports club activities and community service.", goal: "" },
    ],
  },

  pathfinders: {
    team: [
      { ...blankPerson("Pathfinder Director"), bio: "Plans and oversees all club operations, manages the staff team, and ensures quality spiritual and physical programming. Holds Director Certification." },
      { ...blankPerson("Club Counsellor"), bio: "Mentors a unit of Pathfinders, supports spiritual development, and provides personal encouragement within their assigned group." },
      { ...blankPerson("Pathfinder Instructor"), bio: "Teaches honors, outdoor skills and Bible lessons, delivering hands-on training aligned with Investiture Achievement tracks." },
    ],
    events: [
      { name: "Camporee", date: "August (regional)", description: "Multi-club outdoor gathering with competitions, skill demonstrations, spiritual emphasis, camping and fellowship." },
      { name: "Pathfinder Bible Experience (Bible Bowl)", date: "April", description: "Teams of six compete after studying assigned books of the Bible, advancing through Area, Conference and Union finals." },
      { name: "Investiture Ceremony", date: "Spring / Fall", description: "Members are formally recognised and invested in the next achievement level before the church congregation." },
    ],
    fundraising: [
      { title: "Camporee Travel Fund", description: "Car wash and service projects raising funds for camporee registration and travel costs.", goal: "" },
      { title: "Uniform Sponsorship Drive", description: "Sponsor a Pathfinder's uniform or sash so financial need never keeps a child out of the club.", goal: "" },
      { title: "Camping & Honors Supplies", description: "Bake sales and food projects fund camping equipment, honors materials and staff training certification.", goal: "" },
    ],
  },

  "sabbath-school": {
    team: [
      { ...blankPerson("Sabbath School Superintendent"), bio: "Oversees the entire Sabbath School program, coordinates divisions, directs opening exercises and presents mission information." },
      { ...blankPerson("Assistant Superintendent"), bio: "Leads an age-specific division, facilitates lesson discussion and ensures lesson engagement and attendance." },
      { ...blankPerson("Class Teacher"), bio: "Prepares the weekly Bible lesson, guides interactive study and mentors class members in daily Christian living." },
    ],
    events: [
      { name: "Mission Spotlight", date: "Weekly", description: "Short presentation of current Adventist mission work, prayer needs and stories tied to the week's lesson theme." },
      { name: "13th Sabbath Offering", date: "Quarterly", description: "Special offering supporting major mission projects voted by the world church each quarter." },
      { name: "Quarterly Lesson Launch", date: "Quarterly", description: "Introduction to the new lesson theme with renewed commitment to daily Bible study throughout the quarter." },
    ],
    fundraising: [
      { title: "Weekly Mission Offerings", description: "Regular contributions funding both local Sabbath School operations and global mission work.", goal: "" },
      { title: "13th Sabbath Overflow", description: "Enhanced quarter-end giving supporting hospitals, schools and church construction projects voted by world leadership.", goal: "" },
      { title: "Class & Division Projects", description: "Small-group service activities that build fellowship and generate support for local or mission causes.", goal: "" },
    ],
  },

  youth: {
    team: [
      { ...blankPerson("Youth Director / Leader"), bio: "Oversees all youth programs, coordinates activities, mentors student leaders and casts the spiritual vision for the department." },
      { ...blankPerson("Senior Youth Sponsor"), bio: "Mentors the 18-25 age group, leads outreach and mission projects, and provides discipleship and leadership development." },
      { ...blankPerson("AY Secretary / Coordinator"), bio: "Manages AY vespers schedules, communications, event logistics and attendance records." },
    ],
    events: [
      { name: "AY Vespers", date: "Weekly · Friday 18:00", description: "Inspirational worship, music, testimonies and fellowship welcoming young people of every background." },
      { name: "Global Youth Day", date: "March (annual)", description: "Worldwide day of service in which Adventist youth move from church to community with practical acts of love." },
      { name: "Annual Youth Camp", date: "December / January", description: "Multi-day spiritual retreat with Bible study, recreation, team-building and meaningful friendships." },
    ],
    fundraising: [
      { title: "Camp Scholarships", description: "Sponsor a young person who can't afford camp fees so no youth is left behind because of money.", goal: "" },
      { title: "Mission Trip Support", description: "Fund local and international outreach trips where our youth serve communities with the gospel.", goal: "" },
      { title: "Youth Ministry Equipment", description: "Sound system, AY hall furnishings and activity supplies for vespers, retreats and outreach.", goal: "" },
    ],
  },

  health: {
    team: [
      { ...blankPerson("Health Ministries Director"), bio: "Sets the church's health ministry strategy, coordinates programs, trains volunteers and reports to church leadership." },
      { ...blankPerson("Health Educator / Coordinator"), bio: "Delivers lifestyle education, facilitates CHIP programs, conducts screenings and leads cooking classes for the community." },
      { ...blankPerson("Wellness Coach"), bio: "Provides one-on-one lifestyle coaching and bridges health professionals with community members seeking change." },
    ],
    events: [
      { name: "Health Emphasis Sabbath", date: "Quarterly", description: "A Sabbath service highlighting the eight NEWSTART principles with testimonies and wellness teaching." },
      { name: "Community Health Expo", date: "Spring & Autumn", description: "Free screenings, wellness demonstrations, plant-based food samples and resource distribution open to all." },
      { name: "CHIP / Lifestyle Program", date: "Seasonal · multi-week", description: "Structured course on nutrition, exercise and stress management with group support and certified facilitators." },
    ],
    fundraising: [
      { title: "Health Expo Resources", description: "Fund signage, printed material kits and educational resources for community distribution at health expos.", goal: "" },
      { title: "Screening Equipment", description: "Equip the mobile screening station with blood-pressure monitors, glucose meters, scales and supplies.", goal: "" },
      { title: "Vegetarian Cookbook Project", description: "Print plant-based recipe booklets for community give-aways and entry-level cooking classes.", goal: "" },
    ],
  },

  "family-life": {
    team: [
      { ...blankPerson("Family Life Director"), bio: "Coordinates marriage, parenting and family-fellowship programming and resources for every season of family life." },
      { ...blankPerson("Marriage Mentor"), bio: "Walks with engaged and married couples, offering Christ-centred encouragement, pre-marital prep and ongoing mentorship." },
      { ...blankPerson("Parenting Coordinator"), bio: "Plans parenting workshops and resources supporting parents of children of every age." },
    ],
    events: [
      { name: "Christian Home & Marriage Week", date: "February", description: "Annual emphasis week with sermons, seminars and family-activity evenings centred on marriage and home life." },
      { name: "Marriage Enrichment Weekend", date: "Annual", description: "Weekend retreat for couples — biblical teaching, communication tools and intentional time away together." },
      { name: "Family Fun Day", date: "Annual", description: "Cross-generational church-wide picnic and games celebrating Adventist family life and fellowship." },
    ],
    fundraising: [
      { title: "Couple Retreat Sponsorship", description: "Sponsor a couple who could not otherwise afford the annual marriage enrichment retreat.", goal: "" },
      { title: "Family Resource Library", description: "Stock the church library with Christian marriage, parenting and family-devotional resources for free borrowing.", goal: "" },
      { title: "Counselling Support Fund", description: "Subsidise professional Christian counselling for families walking through a crisis season.", goal: "" },
    ],
  },

  "womens-ministries": {
    team: [
      { ...blankPerson("Women's Ministries Director"), bio: "Leads vision, oversees department operations, coordinates programs and mentors women leaders across all life stages." },
      { ...blankPerson("Prayer Coordinator"), bio: "Organises prayer breakfasts, the International Women's Day of Prayer and ongoing intercessory prayer networks." },
      { ...blankPerson("Mentorship Coordinator"), bio: "Pairs women in intentional mentoring relationships for spiritual growth, family life and leadership development." },
    ],
    events: [
      { name: "International Women's Day of Prayer", date: "March (1st Sabbath)", description: "Worldwide day of corporate prayer and spiritual strengthening for Adventist women across every division." },
      { name: "Women's Ministries Emphasis Day", date: "June (2nd Sabbath)", description: "Women lead the worship service, sharing the mission of the department and the heart of the ministry." },
      { name: "enditnow® Emphasis Day", date: "August (4th Sabbath)", description: "Church-wide abuse-prevention day with resources on safety, healing and supporting survivors." },
    ],
    fundraising: [
      { title: "Retreat Scholarship Fund", description: "Sponsor women who could not otherwise attend the annual retreat — every woman matters.", goal: "" },
      { title: "enditnow® Project Support", description: "Resource abuse-prevention and survivor-support work in our community and partner churches.", goal: "" },
      { title: "Women's Education Bursary", description: "Help an Adventist woman in our church pursue further education and her God-given calling.", goal: "" },
    ],
  },

  "mens-ministry": {
    team: [
      { ...blankPerson("Men's Ministry Coordinator"), bio: "Develops programs, mentors emerging male leaders, and coordinates with the pastor and church board for men's spiritual growth." },
      { ...blankPerson("Mentorship / Discipleship Lead"), bio: "Coordinates one-on-one discipleship pairs and father-son or buddy mentoring within the group." },
      { ...blankPerson("Outreach Coordinator"), bio: "Organises community service projects — yard work for widows, home repairs and disaster-relief response." },
    ],
    events: [
      { name: "Men's Emphasis Sabbath", date: "Annual", description: "Worship service celebrating men's spiritual leadership in the home and the local church." },
      { name: "Annual Men's Retreat", date: "Spring or Autumn", description: "Weekend retreat for prayer, Bible study, team-building and spiritual renewal away from routine." },
      { name: "Monthly Prayer Breakfast", date: "1st Sabbath each month", description: "Early-morning fellowship with breakfast, prayer, a short Bible message and honest conversation." },
    ],
    fundraising: [
      { title: "Men's Retreat Costs", description: "Modest participant fees and special offerings cover venue, food and speaker honorariums for the annual retreat.", goal: "" },
      { title: "Community Service Projects", description: "Resource home-repair, yard-work and disaster-response projects serving widows, seniors and families in need.", goal: "" },
      { title: "Youth Mentoring Partnership", description: "Joint funding with Pathfinders / Youth for father-son outings, mentoring weekends and outreach.", goal: "" },
    ],
  },

  stewardship: {
    team: [
      { ...blankPerson("Stewardship Director"), bio: "Sets the ministry vision and strategic plan; coordinates stewardship initiatives across the local congregation." },
      { ...blankPerson("Resource Coordinator"), bio: "Manages publications, devotional readings, commitment cards and promotional materials for stewardship emphasis." },
      { ...blankPerson("Seminar Facilitator"), bio: "Delivers stewardship training, personal-finance workshops and the Stewardship Leadership Visitation curriculum locally." },
    ],
    events: [
      { name: "Stewardship Revival Week (\u201CGod First\u201D)", date: "Quarterly emphasis", description: "Multi-Sabbath sermons, activities and testimonies on whole-life stewardship and spiritual surrender." },
      { name: "Stewardship Emphasis Sabbath", date: "September / October", description: "Annual focus on tithe principles, gratitude testimony and the Combined Offering Plan." },
      { name: "Personal Finance Workshop", date: "Annual", description: "Practical biblical training on budgeting, saving and faithful giving for individuals and families." },
    ],
    fundraising: [
      { title: "Combined Offering Plan Education", description: "Promote and explain the COP so members see how their offerings fund local operations and global mission together.", goal: "" },
      { title: "Special Project Offerings", description: "Coordinate church-voted offerings for building, disaster-relief and mission projects with stewardship teaching.", goal: "" },
      { title: "Tithe Commitment Campaign", description: "Annual pledge-renewal initiative framing tithing as a spiritual discipline, not pressure giving.", goal: "" },
    ],
  },

  "personal-ministry": {
    team: [
      { ...blankPerson("Personal Ministries Director"), bio: "Oversees disciple-making strategy, recruits volunteers and coordinates outreach across the local congregation." },
      { ...blankPerson("Bible Worker Coordinator"), bio: "Trains members for Bible-study ministry, manages study materials and tracks community interests through to baptism." },
      { ...blankPerson("Literature & Community Services Coordinator"), bio: "Manages the literature fund, GLOW tract distribution and community-aid initiatives." },
    ],
    events: [
      { name: "Lay Evangelism Day", date: "September", description: "Global emphasis day mobilising every member for personal evangelism and community outreach." },
      { name: "Global Mission Day", date: "March (4th Sabbath)", description: "Focus on international mission support and Adventist disciple-making partnerships worldwide." },
      { name: "Community Services Emphasis", date: "October", description: "Coordinated distribution of Steps to Christ and practical community-service projects in our neighbourhood." },
    ],
    fundraising: [
      { title: "Literature Fund", description: "Donations supplying GLOW tracts, Steps to Christ booklets and Bible-study guides for free community distribution.", goal: "" },
      { title: "Evangelism Series", description: "Underwrite advertising, hall hire and speaker honorariums for local public evangelism campaigns.", goal: "" },
      { title: "Small-Group Ministry", description: "Resource small-group leadership training and Bible-study materials for member-led groups across the city.", goal: "" },
    ],
  },

  communication: {
    team: [
      { ...blankPerson("Communication Director"), bio: "Oversees the communication strategy, manages the media team and ensures consistent, Christ-honouring messaging across every channel." },
      { ...blankPerson("Social Media & Bulletin Coordinator"), bio: "Produces the weekly bulletin, manages our social platforms and engages the church family and wider community online." },
      { ...blankPerson("Livestream & Video Coordinator"), bio: "Runs the Sabbath livestream, edits event videos and maintains the church video archive." },
    ],
    events: [
      { name: "Communication Sabbath", date: "November", description: "Annual emphasis promoting the communication ministry and recruiting and training media volunteers." },
      { name: "Graphics & Design Workshop", date: "Monthly (1st Friday)", description: "Skill-building evening on bulletin design, social-media visuals and Adventist branding." },
      { name: "Year-End Recap Video", date: "December", description: "Highlight reel of the year's ministry milestones, baptisms and community impact." },
    ],
    fundraising: [
      { title: "Equipment Upgrades", description: "Fund cameras, microphones, lighting, livestream gear and video-editing tools.", goal: "" },
      { title: "Website & Hosting", description: "Annual support for domain renewal, hosting, email and digital-platform maintenance.", goal: "" },
      { title: "Branded Print Materials", description: "Welcome cards, event posters and invitation flyers for outreach and visitor follow-up.", goal: "" },
    ],
  },

  treasury: {
    team: [
      { ...blankPerson("Church Treasurer"), bio: "Primary custodian of all church funds — manages deposits, prepares reports and ensures full compliance with denominational policy." },
      { ...blankPerson("Assistant Treasurer"), bio: "Assists with collections, recording, donor-receipt generation and audit document preparation." },
      { ...blankPerson("Offering Counters Team Lead"), bio: "Supervises the weekly counting team, ensures accuracy and reconciles tithes and offerings before deposit." },
    ],
    events: [
      { name: "Annual Budget Sabbath", date: "January", description: "Presentation of the yearly church budget to the congregation, with member voting on financial allocations." },
      { name: "Annual Financial Audit", date: "February \u2013 March", description: "External audit of treasury records and fund allocations for full transparency and accountability." },
      { name: "Year-End Giving Statements", date: "December", description: "Distribution of annual giving statements and tax receipts to every donor in our church family." },
    ],
    fundraising: [
      { title: "Building Fund", description: "Capital campaign for facility renovation, expansion and long-term church infrastructure.", goal: "" },
      { title: "World Mission Appeal", description: "Special offerings funding Adventist mission projects voted by the General Conference and division.", goal: "" },
      { title: "Capital Improvement Drive", description: "Member-designated gifts for major upgrades to the sanctuary, sound, classrooms and grounds.", goal: "" },
    ],
  },
};

export function getMinistryDetail(id: string): MinistryDetail | undefined {
  return ministryDetails[id];
}
