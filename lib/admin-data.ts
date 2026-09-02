export const researchProjects = [
  {
    id: "RES-2041",
    title: "Climate-smart cassava for the derived savanna",
    faculty: "Agriculture",
    lead: "Prof. Ngozi Eze",
    unit: "Dept. of Crop Science",
    year: "2025",
    status: "Active",
    funding: "TETFund NRF",
  },
  {
    id: "RES-1988",
    title: "Malaria parasite diversity in Enugu State",
    faculty: "Medicine",
    lead: "Dr. Chinedu Okeke",
    unit: "College of Medicine",
    year: "2024",
    status: "Active",
    funding: "WHO AFRO",
  },
  {
    id: "RES-2112",
    title: "Village-scale solar microgrids for Nsukka",
    faculty: "Engineering",
    lead: "Engr. Adaobi Nwankwo",
    unit: "Dept. of Electrical Engineering",
    year: "2025",
    status: "Recruiting",
    funding: "UNN Senate Research",
  },
  {
    id: "RES-1874",
    title: "Igbo oral archives and digital restitution",
    faculty: "Humanities",
    lead: "Prof. Ifeoma Umeh",
    unit: "Institute of African Studies",
    year: "2024",
    status: "Active",
    funding: "ACLS",
  },
  {
    id: "RES-1650",
    title: "Nsukka yellow pepper value-chain genetics",
    faculty: "Agriculture",
    lead: "Dr. Kelechi Uzochukwu",
    unit: "Dept. of Agricultural Economics",
    year: "2023",
    status: "Completed",
    funding: "TETFund IBR",
  },
  {
    id: "RES-2203",
    title: "Low-cost HPLC methods for herbal quality",
    faculty: "Medicine",
    lead: "Pharm. Amaka Obi",
    unit: "Faculty of Pharmaceutical Sciences",
    year: "2025",
    status: "Under review",
    funding: "Pending",
  },
] as const;

export const equipmentItems = [
  {
    id: "EQ-SEM-01",
    name: "Scanning Electron Microscope",
    lab: "Central Research Laboratory",
    location: "Faculty of Physical Sciences",
    availability: "Available",
    window: "Next slot: today, 14:00",
    custodian: "Mr. Ikenna Obi",
  },
  {
    id: "EQ-PCR-04",
    name: "PCR Thermal Cycler",
    lab: "Molecular Biology Suite",
    location: "Faculty of Biological Sciences",
    availability: "In use",
    window: "Frees at 16:30",
    custodian: "Dr. Nneka Ibe",
  },
  {
    id: "EQ-NMR-02",
    name: "500 MHz NMR Spectrometer",
    lab: "Advanced Chemistry Lab",
    location: "Dept. of Pure & Industrial Chemistry",
    availability: "Available",
    window: "Book 48 hours ahead",
    custodian: "Prof. Emeka Ani",
  },
  {
    id: "EQ-HPLC-03",
    name: "HPLC System",
    lab: "Drug Quality Unit",
    location: "Faculty of Pharmaceutical Sciences",
    availability: "Maintenance",
    window: "Back online Thursday",
    custodian: "Pharm. Amaka Obi",
  },
  {
    id: "EQ-GC-06",
    name: "Plant Growth Chambers",
    lab: "Crop Physiology House",
    location: "Faculty of Agriculture",
    availability: "Available",
    window: "Three chambers free",
    custodian: "Prof. Ngozi Eze",
  },
  {
    id: "EQ-HPC-01",
    name: "High-Performance Compute Node",
    lab: "ICT Research Cluster",
    location: "Nnamdi Azikiwe Library annex",
    availability: "In use",
    window: "Queue: 2 jobs",
    custodian: "Engr. Adaobi Nwankwo",
  },
] as const;

export const researchers = [
  {
    id: "UNN-R-1102",
    name: "Prof. Ngozi Eze",
    email: "ngozi.eze@unn.edu.ng",
    faculty: "Agriculture",
    role: "Academic staff",
    status: "Active",
    projects: 4,
  },
  {
    id: "UNN-R-1188",
    name: "Dr. Chinedu Okeke",
    email: "chinedu.okeke@unn.edu.ng",
    faculty: "Medicine",
    role: "Academic staff",
    status: "Active",
    projects: 3,
  },
  {
    id: "UNN-R-1240",
    name: "Engr. Adaobi Nwankwo",
    email: "adaobi.nwankwo@unn.edu.ng",
    faculty: "Engineering",
    role: "Research fellow",
    status: "Pending",
    projects: 1,
  },
  {
    id: "UNN-R-1091",
    name: "Prof. Ifeoma Umeh",
    email: "ifeoma.umeh@unn.edu.ng",
    faculty: "Arts",
    role: "Academic staff",
    status: "Active",
    projects: 2,
  },
  {
    id: "UNN-R-1314",
    name: "Dr. Kelechi Uzochukwu",
    email: "kelechi.uzochukwu@unn.edu.ng",
    faculty: "Agriculture",
    role: "Postgraduate researcher",
    status: "Active",
    projects: 2,
  },
  {
    id: "UNN-R-1402",
    name: "Pharm. Amaka Obi",
    email: "amaka.obi@unn.edu.ng",
    faculty: "Pharmaceutical Sciences",
    role: "Academic staff",
    status: "Pending",
    projects: 1,
  },
  {
    id: "UNN-R-0877",
    name: "Prof. Emeka Ani",
    email: "emeka.ani@unn.edu.ng",
    faculty: "Physical Sciences",
    role: "Academic staff",
    status: "Suspended",
    projects: 0,
  },
] as const;

export const recentActivity = [
  {
    time: "12 min ago",
    actor: "Pharm. Amaka Obi",
    action: "submitted HPLC herbal-quality protocol for ethics review",
  },
  {
    time: "1 hr ago",
    actor: "Central Research Lab",
    action: "flagged SEM filament replacement after 180 hours",
  },
  {
    time: "3 hr ago",
    actor: "ORID desk",
    action: "approved Engr. Adaobi Nwankwo as co-investigator on RES-2112",
  },
  {
    time: "Yesterday",
    actor: "Prof. Ngozi Eze",
    action: "uploaded TETFund NRF concept note for cassava breeding",
  },
];

export const facultyCounts = [
  { faculty: "Agriculture", count: 42 },
  { faculty: "Medicine", count: 31 },
  { faculty: "Engineering", count: 24 },
  { faculty: "Physical Sciences", count: 18 },
  { faculty: "Humanities", count: 13 },
];

export type AdminUserStatus = "Active" | "Pending" | "Suspended";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  unit: string;
  role: string;
  lastActive: string;
  status: AdminUserStatus;
};

export const userRoles = [
  "Super-admin",
  "Admin",
  "Director",
  "Officer",
] as const;

export const users: AdminUser[] = [
  {
    id: "UNN-U-0001",
    name: "ORID Super Admin",
    email: "admin@unn.edu.ng",
    unit: "Office of Research",
    role: "Super-admin",
    lastActive: "Just now",
    status: "Active",
  },
  {
    id: "UNN-U-0042",
    name: "Mrs. Chioma Okorie",
    email: "chioma.okorie@unn.edu.ng",
    unit: "ORID Nsukka",
    role: "Admin",
    lastActive: "12 min ago",
    status: "Active",
  },
  {
    id: "UNN-U-0088",
    name: "Mr. Ikenna Obi",
    email: "ikenna.obi@unn.edu.ng",
    unit: "Central Research Laboratory",
    role: "Officer",
    lastActive: "1 hr ago",
    status: "Active",
  },
  {
    id: "UNN-U-0115",
    name: "Dr. Nneka Ibe",
    email: "nneka.ibe@unn.edu.ng",
    unit: "Faculty of Biological Sciences",
    role: "Director",
    lastActive: "Yesterday",
    status: "Active",
  },
  {
    id: "UNN-U-0160",
    name: "Barr. Uche Nnaji",
    email: "uche.nnaji@unn.edu.ng",
    unit: "Ethics & integrity desk",
    role: "Officer",
    lastActive: "3 days ago",
    status: "Pending",
  },
  {
    id: "UNN-U-0194",
    name: "Mr. Tochukwu Eze",
    email: "tochukwu.eze@unn.edu.ng",
    unit: "ICT Research Cluster",
    role: "Officer",
    lastActive: "Never",
    status: "Suspended",
  },
];
