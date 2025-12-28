import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.model.js';
import Project from '../models/Project.model.js';
import About from '../models/About.model.js';
import { uploadImage } from '../services/cloudinary.service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to upload local images to Cloudinary
const uploadLocalImage = async (imagePath, folder) => {
  try {
    const fullPath = path.join(__dirname, '../../src/assets', imagePath);
    if (fs.existsSync(fullPath)) {
      const result = await uploadImage(fullPath, folder);
      return result.secure_url;
    }
    return null;
  } catch (error) {
    console.error(`Failed to upload ${imagePath}:`, error.message);
    return null;
  }
};

const seedServices = async () => {
  console.log('🌱 Seeding Services...');
  
  const servicesData = [
    {
      id: 'structural',
      title: 'Structural Steel Erection',
      description: 'Complete fabrication and erection of industrial structures with precision engineering and safety compliance.',
      image: await uploadLocalImage('projects-steel.jpg', 'services'),
      features: [
        'Heavy structural steel fabrication',
        'Industrial building frameworks',
        'Warehouse and factory structures',
        'Equipment support structures',
        'Crane runways and gantries',
        'Multi-story steel buildings',
      ],
      icon: 'Building2',
      order: 1,
      isActive: true,
    },
    {
      id: 'equipment',
      title: 'Equipment Installation',
      description: 'Expert alignment and installation of mechanical equipment for optimal performance in industrial facilities.',
      image: await uploadLocalImage('services-crane.jpg', 'services'),
      features: [
        'Rotary and static equipment erection',
        'Gas turbines and steam turbines',
        'Boiler installation',
        'ESP and duct systems',
        'EOT crane erection',
        'Conveyor systems',
      ],
      icon: 'Wrench',
      order: 2,
      isActive: true,
    },
    {
      id: 'piping',
      title: 'Piping Works',
      description: 'Comprehensive piping fabrication and erection services for industrial applications across sectors.',
      image: await uploadLocalImage('services-piping.jpg', 'services'),
      features: [
        'Process piping systems',
        'High-pressure piping',
        'Gas distribution networks',
        'Utility piping systems',
        'Piping stress analysis',
        'Testing and commissioning',
      ],
      icon: 'HardHat',
      order: 3,
      isActive: true,
    },
    {
      id: 'maintenance',
      title: 'Plant Maintenance',
      description: 'Ongoing maintenance services to ensure optimal plant performance and minimize downtime.',
      image: await uploadLocalImage('services-crane.jpg', 'services'),
      features: [
        'Preventive maintenance programs',
        'Shutdown maintenance',
        'Equipment overhauls',
        'Breakdown repairs',
        'Performance optimization',
        'Reliability engineering',
      ],
      icon: 'Settings',
      order: 4,
      isActive: true,
    },
  ];

  for (const service of servicesData) {
    await Service.findOneAndUpdate(
      { id: service.id },
      service,
      { upsert: true, new: true }
    );
  }
  console.log('✅ Services seeded');
};

const seedProjects = async () => {
  console.log('🌱 Seeding Projects...');
  
  const projectsData = [
    {
      title: 'AMNS India - CRM 2 Project',
      client: 'AMNS',
      category: 'Steel Plants',
      location: 'Hazira',
      duration: '2022 - Present',
      description: 'PLTCM Structure & Equipment erection for Cold Rolling Mill expansion project.',
      image: await uploadLocalImage('projects-steel.jpg', 'projects'),
      order: 1,
      isActive: true,
    },
    {
      title: 'JSW HSM-2 Project',
      client: 'JSW',
      category: 'Steel Plants',
      location: 'Dolvi',
      duration: '2018 - 2021',
      description: 'Structure, Equipment and Piping Erection for Hot Strip Mill project.',
      image: await uploadLocalImage('services-crane.jpg', 'projects'),
      order: 2,
      isActive: true,
    },
    {
      title: 'Essar Power Plant',
      client: 'ESSAR',
      category: 'Power Plants',
      location: 'Hazira',
      duration: '2011 - 2013',
      description: 'Boiler and Turbine Auxiliary equipment installation and maintenance.',
      image: await uploadLocalImage('projects-power.jpg', 'projects'),
      order: 3,
      isActive: true,
    },
    {
      title: 'AMNS Coke Oven Project',
      client: 'AMNS',
      category: 'Steel Plants',
      location: 'Hazira',
      duration: '2024 - Present',
      description: 'Complete piping and structural work for new coke oven facility.',
      image: await uploadLocalImage('services-piping.jpg', 'projects'),
      order: 4,
      isActive: true,
    },
    {
      title: 'Reliance Industries - HMD',
      client: 'RELIANCE',
      category: 'Refineries',
      location: 'Hazira',
      duration: '2002 - 2007',
      description: 'Structure, Equipment, Piping and Gas Turbine installation.',
      image: await uploadLocalImage('projects-steel.jpg', 'projects'),
      order: 5,
      isActive: true,
    },
    {
      title: 'JSW JVML BF Project',
      client: 'JSW',
      category: 'Steel Plants',
      location: 'Bellary',
      duration: '2024 - Present',
      description: 'Fabrication and erection of piping for Blast Furnace project.',
      image: await uploadLocalImage('services-crane.jpg', 'projects'),
      order: 6,
      isActive: true,
    },
    {
      title: 'NTPC Gas Based Plant',
      client: 'NTPC',
      category: 'Power Plants',
      location: 'Various',
      duration: '1991 - 1999',
      description: 'Gas based boiler installation across multiple NTPC locations.',
      image: await uploadLocalImage('projects-power.jpg', 'projects'),
      order: 7,
      isActive: true,
    },
    {
      title: 'Delhi Metro Railway',
      client: 'DMRC',
      category: 'Infrastructure',
      location: 'Delhi',
      duration: '2002 - 2003',
      description: 'Structural steel erection for Delhi Metro infrastructure.',
      image: await uploadLocalImage('projects-steel.jpg', 'projects'),
      order: 8,
      isActive: true,
    },
    {
      title: 'Hanji Khad Bridge',
      client: 'AMNS',
      category: 'Infrastructure',
      location: 'Hazira',
      duration: '2020 - 2022',
      description: "Fabrication of India's first cable-stayed railway bridge.",
      image: await uploadLocalImage('services-crane.jpg', 'projects'),
      order: 9,
      isActive: true,
    },
  ];

  for (const project of projectsData) {
    await Project.findOneAndUpdate(
      { title: project.title, client: project.client },
      project,
      { upsert: true, new: true }
    );
  }
  console.log('✅ Projects seeded');
};

const seedAbout = async () => {
  console.log('🌱 Seeding About content...');
  
  const aboutData = {
    heroTitle: 'Building a Legacy of Excellence',
    heroDescription: 'For over 40 years, BEPL has been at the forefront of industrial construction, delivering precision engineering and unwavering commitment to safety.',
    aboutContent: `The company M/s BABU ERECTORS PVT.LTD was formed in the year 2013, as a sister concern of BABU ENGINEERING WORKS, established in 1982. We are the leading contractors in the area of Fabrication and Erection of Structural works, Erection and Alignment of Mechanical Equipments, and Fabrication and Erection of Piping works.

With the Head Office situated in Surat (Gujarat), Babu Erectors operates across India with the highest ethical and professional standards. Our vision encompasses the tradition of delivering quality by adopting best construction practices in the industry.

We specialize in mechanical and structural works, including fabrication and erection of Structural, Piping & Equipment for commercial and industrial clients. With over 40 years in the business, we've earned tremendous appreciation from our clients.`,
    vision: `To be the most trusted and preferred partner in industrial construction, recognized for our commitment to excellence, safety, and innovation. We aim to set industry benchmarks in structural steel erection and heavy engineering services across India.`,
    mission: `To deliver quality construction services with unwavering commitment to safety and on-time delivery. We strive to understand our clients' needs, provide technological solutions that add business value, and maintain the highest ethical and professional standards.`,
    values: [
      {
        icon: 'Shield',
        title: 'Safety First',
        description: 'Zero-accident policy is our fundamental requirement for all operations.',
      },
      {
        icon: 'Target',
        title: 'Quality Focus',
        description: 'ISO certified processes ensuring highest quality standards.',
      },
      {
        icon: 'Users',
        title: 'Team Excellence',
        description: '103+ engineers, 209+ supervisors, 3000+ skilled technicians.',
      },
      {
        icon: 'Award',
        title: 'Client Partnership',
        description: 'We treat our clients as partners for mutual success.',
      },
    ],
    milestones: [
      {
        year: '1982',
        title: 'Foundation',
        description: 'Babu Engineering Works established in Surat, Gujarat',
      },
      {
        year: '2013',
        title: 'Incorporation',
        description: 'Babu Erectors Pvt. Ltd. formed as a sister concern',
      },
      {
        year: '2018',
        title: 'HSE Excellence',
        description: 'Awarded Best HSE Conscious Contractor by ESSAR',
      },
      {
        year: '2024',
        title: 'Continued Growth',
        description: 'Operating major projects across India',
      },
    ],
    certifications: [
      'ISO 9001:2015 - Quality Management System',
      'ISO 45001:2018 - Occupational Health & Safety',
      'Contractor Safety Performance Award 2012',
      'Best HSE Conscious Contractor 2018-2019',
    ],
    teamStats: {
      engineers: 103,
      supervisors: 209,
      technicians: 3000,
      yearsExperience: 40,
    },
    mdMessage: {
      name: 'K. Samuel',
      position: 'Managing Director',
      message: `It is my pleasure to communicate with you the 40 Years of business of BABU ERECTORS PVT LTD. Since founded in 1982, we have achieved new levels of growth through implementing a wide range of projects and positioned ourselves as one of the leading Engineering Companies in India.

Being an engineering company, we have never compromised on the quality of safety work. We have always ensured safety as a fundamental requirement for the continuation of our business operations. Our 'Zero-accidental' policy has always set a benchmark for our goals.

We consider the people at BEPL as one team and treat each other with equal respect. Together we will achieve our goals.`,
    },
  };

  await About.findOneAndUpdate({}, aboutData, { upsert: true, new: true });
  console.log('✅ About content seeded');
};

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bepl');
    console.log('✅ Connected to MongoDB');

    await seedServices();
    await seedProjects();
    await seedAbout();

    console.log('🎉 All data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedAll();

