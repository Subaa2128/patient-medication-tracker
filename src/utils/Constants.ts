export const users = [
  {
    username: "john_doe",
    password: "12345",
    profile: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      address: "123 Main St, New York, NY",
      weight: "75 kg",
      height: "180 cm",
      gender: "Male",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fprofile&psig=AOvVaw0C76-TfjUrGdbCzp50oSvU&ust=1742791080828000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLDty-6wn4wDFQAAAAAdAAAAABAE",
    },
    medicines: [
      {
        id: "med1",
        name: "Lisinopril",
        strength: "10mg",
        condition: "Hypertension",
        instructions: "Take once daily in the morning",
        schedule: [
          {
            time: "08:00",
            dosage: "1 tablet",
            withFood: false,
            take:true,
            skipped:false
          },
          {
            time: "08:00",
            dosage: "1 tablet",
            withFood: false,
            take:false,
            skipped:true
          },
        ],
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        timePeriod: {
          from: "08:00",
          to: "20:00",
        },
        sideEffects: ["Dry cough", "Dizziness"],
        interactions: ["NSAIDs", "Potassium supplements"],
      },
    ],
  },
  {
    username: "jane_smith",
    password: "abc123",
    profile: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      address: "456 Oak St, Los Angeles, CA",
      weight: "65 kg",
      height: "165 cm",
      gender: "Female",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fprofile-picture&psig=AOvVaw0C76-TfjUrGdbCzp50oSvU&ust=1742791080828000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLDty-6wn4wDFQAAAAAdAAAAABAJ",
    },
    medicines: [
      {
        id: "med2",
        name: "Metformin",
        strength: "500mg",
        condition: "Diabetes",
        instructions: "Take twice daily with meals",
        schedule: [
          {
            time: "08:00",
            dosage: "1 tablet",
            withFood: true,
          },
          {
            time: "20:00",
            dosage: "1 tablet",
            withFood: true,
          },
        ],
        startDate: "2023-06-01",
        endDate: "2024-05-31",
        timePeriod: {
          from: "07:00",
          to: "21:00",
        },
        sideEffects: ["Nausea", "Stomach upset"],
        interactions: ["Alcohol", "Insulin"],
      },
    ],
  },
  {
    username: "alex_turner",
    password: "pass456",
    profile: {
      name: "Alex Turner",
      email: "alex.turner@example.com",
      phone: "555-123-4567",
      address: "789 Pine St, Chicago, IL",
      weight: "80 kg",
      height: "175 cm",
      gender: "Male",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%2Fimages%3Fk%3Dman%2Bprofile%2Bwhite%2Bbackground&psig=AOvVaw0C76-TfjUrGdbCzp50oSvU&ust=1742791080828000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLDty-6wn4wDFQAAAAAdAAAAABAR",
    },
  },
  {
    username: "sophia_lee",
    password: "sophia123",
    profile: {
      name: "Sophia Lee",
      email: "sophia.lee@example.com",
      phone: "321-654-9870",
      address: "101 Elm St, Seattle, WA",
      weight: "58 kg",
      height: "162 cm",
      gender: "Female",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fsarahclaysocial.com%2F10-linkedin-profile-picture-tips%2F&psig=AOvVaw0C76-TfjUrGdbCzp50oSvU&ust=1742791080828000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLDty-6wn4wDFQAAAAAdAAAAABAZ",
    },
  },
  {
    username: "michael_brown",
    password: "mike789",
    profile: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "777-888-9999",
      address: "202 Cedar St, Boston, MA",
      weight: "90 kg",
      height: "185 cm",
      gender: "Male",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcultivatedculture.com%2Flinkedin-profile-picture%2F&psig=AOvVaw0C76-TfjUrGdbCzp50oSvU&ust=1742791080828000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLDty-6wn4wDFQAAAAAdAAAAABAp",
    },
  },
  {
    username: "emily_clark",
    password: "emily123",
    profile: {
      name: "Emily Clark",
      email: "emily.clark@example.com",
      phone: "444-555-6666",
      address: "303 Birch St, Miami, FL",
      weight: "68 kg",
      height: "170 cm",
      gender: "Female",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Ffixthephoto.com%2Flinkedin-profile-picture-tips.html&psig=AOvVaw0C76-TfjUrGdbCzp50oSvU&ust=1742791080828000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLDty-6wn4wDFQAAAAAdAAAAABAx",
    },
  },
];

export const doctors = [
  {
    doctorId: "doc1",
    name: "Dr. Olivia Wilson",
    specialization: "Cardiology",
    email: "olivia.wilson@healthcare.com",
    phone: "111-222-3333",
    address: "Heart Care Clinic, 123 Health St, New York, NY",
    password: "cardio123",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fdoctor-profile&psig=AOvVaw20WqBdCctV1Z6cFeXtqtw3&ust=1742791326000000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPii8eSxn4wDFQAAAAAdAAAAABAE",
    patients: ["john_doe", "michael_brown"],
  },
  {
    doctorId: "doc2",
    name: "Dr. Ethan Thompson",
    specialization: "Endocrinology",
    email: "ethan.thompson@healthcare.com",
    phone: "444-555-6666",
    address: "Endo Clinic, 456 Wellness Rd, Los Angeles, CA",
    password: "endo456",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fmale-doctor&psig=AOvVaw20WqBdCctV1Z6cFeXtqtw3&ust=1742791326000000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPii8eSxn4wDFQAAAAAdAAAAABAg",
    patients: ["jane_smith", "alex_turner"],
  },
  {
    doctorId: "doc3",
    name: "Dr. Amelia Johnson",
    specialization: "Internal Medicine",
    email: "amelia.johnson@healthcare.com",
    phone: "777-888-9999",
    address: "General Health Clinic, 789 Medical Ave, Chicago, IL",
    password: "med789",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fdoctor-profile-picture&psig=AOvVaw20WqBdCctV1Z6cFeXtqtw3&ust=1742791326000000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPii8eSxn4wDFQAAAAAdAAAAABAo",
    patients: ["sophia_lee", "emily_clark"],
  },
];
