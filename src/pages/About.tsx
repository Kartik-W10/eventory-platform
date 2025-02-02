import { User } from "lucide-react";

const teamMembers = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    bio: "20+ years of experience in professional development and coaching.",
  },
  {
    name: "Jane Smith",
    role: "Head of Training",
    bio: "Expert in corporate training and leadership development.",
  },
  {
    name: "Mike Johnson",
    role: "Senior Consultant",
    bio: "Specialized in career coaching and professional growth.",
  },
];

const About = () => {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are dedicated to empowering professionals with the knowledge, skills,
            and resources they need to excel in their careers and achieve their goals.
          </p>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm card-hover"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">
                  {member.name}
                </h3>
                <p className="text-secondary font-medium mb-4 text-center">
                  {member.role}
                </p>
                <p className="text-gray-600 text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;