import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

const testEvents = [
  {
    organizerSig: "compsoc",
    heroTitle: "Welcome to CompSoc 2025",
    heroTagsCsv: "networking,social,welcome",
    regEnabled: true,
    regTitle: "Join our Welcome Event",
    regDescription:
      "Sign up to meet fellow computer science enthusiasts and learn about CompSoc activities!",
    regButtonText: "Register Now",
    aboutMarkdown: `# Welcome to CompSoc!

Join us for our annual welcome event where you'll meet the committee, learn about our activities throughout the year, and connect with fellow students.

## What to Expect
- Meet the committee members
- Learn about upcoming events
- Network with other students
- Free pizza and drinks!

This is a great opportunity to get involved with the society and make new friends.`,
    locationName: "Informatics Forum",
    locationDesc: "10 Crichton Street, Edinburgh",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2234.234!2d-3.187!3d55.944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapTitle: "Informatics Forum Location",
    date: "2025-01-15",
    time: { start: "18:00", end: "20:00" },
    form: undefined
  },
  {
    organizerSig: "edinburghAI",
    heroTitle: "Introduction to Large Language Models",
    heroTagsCsv: "AI,machine-learning,workshop",
    regEnabled: true,
    regTitle: "Register for AI Workshop",
    regDescription:
      "Learn about the latest developments in LLMs and get hands-on experience!",
    regButtonText: "Sign Up",
    aboutMarkdown: `# Introduction to Large Language Models

Dive into the world of Large Language Models! This workshop will cover:

## Topics
- History and evolution of LLMs
- How transformers work
- Practical applications
- Hands-on coding session

## Prerequisites
- Basic Python knowledge
- Interest in AI/ML

Bring your laptop!`,
    locationName: "Appleton Tower",
    locationDesc: "11 Crichton Street, Room 5.01",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2234.234!2d-3.187!3d55.944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapTitle: "Appleton Tower",
    date: "2025-01-20",
    time: { start: "14:00", end: "17:00" },
    form: {
      fields: [
        {
          id: "experience",
          type: "select",
          label: "Programming Experience",
          required: true,
          options: ["Beginner", "Intermediate", "Advanced"]
        },
        {
          id: "dietary",
          type: "text",
          label: "Dietary Requirements",
          required: false
        }
      ]
    }
  },
  {
    organizerSig: "gameDevSig",
    heroTitle: "Game Jam 2025",
    heroTagsCsv: "game-development,competition,hackathon",
    regEnabled: true,
    regTitle: "Join the Game Jam",
    regDescription: "Create a game in 48 hours! All skill levels welcome.",
    regButtonText: "Register Team",
    aboutMarkdown: `# Game Jam 2025

## 48 Hours to Create Something Amazing!

Join us for our annual game jam where you'll:
- Build a game from scratch
- Work in teams or solo
- Learn from industry professionals
- Win prizes!

### Schedule
**Friday Evening:** Opening ceremony and theme reveal
**Saturday-Sunday:** Development time
**Sunday Evening:** Presentations and awards

### Prizes
- Best Game Overall
- Best Art
- Best Sound Design
- Most Innovative

Food and drinks provided throughout the event!`,
    locationName: "Informatics Forum, G.07",
    locationDesc: "Ground Floor Lab",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2234.234!2d-3.187!3d55.944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapTitle: "Informatics Forum",
    date: "2025-02-07",
    time: { start: "18:00" },
    form: {
      fields: [
        {
          id: "teamName",
          type: "text",
          label: "Team Name",
          required: true
        },
        {
          id: "teamSize",
          type: "select",
          label: "Team Size",
          required: true,
          options: ["Solo", "2 members", "3 members", "4 members", "5 members"]
        }
      ]
    }
  },
  {
    organizerSig: "typeSig",
    heroTitle: "TypeScript Deep Dive",
    heroTagsCsv: "typescript,web-development,tutorial",
    regEnabled: true,
    regTitle: "Learn TypeScript",
    regDescription: "Master advanced TypeScript patterns and best practices",
    regButtonText: "Join Session",
    aboutMarkdown: `# TypeScript Deep Dive

## Advanced TypeScript for Modern Development

This session covers:
- Advanced type system features
- Generic programming
- Type inference and narrowing
- Conditional types
- Template literal types

Perfect for developers who want to level up their TypeScript skills!

**Experience Level:** Intermediate to Advanced`,
    locationName: "Central Library, Room 3.12",
    locationDesc: "George Square",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2234.234!2d-3.187!3d55.944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapTitle: "Central Library",
    date: "2025-01-25",
    time: { start: "16:00", end: "18:00" },
    form: undefined
  },
  {
    organizerSig: "quantSig",
    heroTitle: "Quantitative Finance Career Panel",
    heroTagsCsv: "finance,careers,panel",
    regEnabled: true,
    regTitle: "RSVP for Career Panel",
    regDescription:
      "Meet professionals from top finance firms and learn about careers in quant finance",
    regButtonText: "Reserve Spot",
    aboutMarkdown: `# Quantitative Finance Career Panel

## Meet Industry Professionals

Join us for an evening with quantitative analysts and traders from leading financial firms.

### Panelists Include:
- Senior Quant at Goldman Sachs
- Algorithmic Trader at Jane Street
- Risk Analyst at JP Morgan
- Hedge Fund Manager

### Format
- 30 min panel discussion
- 30 min Q&A
- 30 min networking with refreshments

Great opportunity to learn about:
- Day-to-day work in quant finance
- Required skills and qualifications
- Interview process and tips
- Career progression

**Dress code:** Smart casual`,
    locationName: "Business School, Lecture Theatre 2",
    locationDesc: "29 Buccleuch Place",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2234.234!2d-3.187!3d55.944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapTitle: "Business School",
    date: "2025-02-12",
    time: { start: "18:30", end: "20:00" },
    form: {
      fields: [
        {
          id: "year",
          type: "select",
          label: "Year of Study",
          required: true,
          options: [
            "1st Year",
            "2nd Year",
            "3rd Year",
            "4th Year",
            "Masters",
            "PhD"
          ]
        }
      ]
    }
  },
  {
    organizerSig: "sigInt",
    heroTitle: "Cybersecurity CTF Competition",
    heroTagsCsv: "security,ctf,competition",
    regEnabled: true,
    regTitle: "Join CTF Competition",
    regDescription:
      "Test your hacking skills in our Capture The Flag competition!",
    regButtonText: "Register",
    aboutMarkdown: `# Cybersecurity CTF Competition

## Capture The Flag Challenge

Put your security skills to the test in our CTF competition!

### Categories
- Web Exploitation
- Reverse Engineering
- Cryptography
- Binary Exploitation
- Forensics

### Details
- Teams of 1-4 people
- Beginner-friendly challenges included
- Prizes for top 3 teams
- Hints available during competition

No prior CTF experience required - we'll have challenges for all skill levels!

**What to bring:** Laptop with Kali Linux (VM is fine)`,
    locationName: "Informatics Forum, 4.33",
    locationDesc: "Informatics Forum, 4th Floor",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2234.234!2d-3.187!3d55.944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapTitle: "Informatics Forum",
    date: "2025-02-28",
    time: { start: "12:00", end: "18:00" },
    form: undefined
  }
];

async function main() {
  for (const event of testEvents) {
    await prisma.event.create({
      data: event
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
