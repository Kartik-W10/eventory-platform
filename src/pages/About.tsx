
import PageContent from "@/components/PageContent";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Us</h1>
        
        <div className="prose max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <div className="text-gray-700">
              <PageContent 
                pageKey="about-mission" 
                fallback="To empower researchers and developers with the best tools and resources available."
                className="leading-relaxed" 
              />
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              We are a team of passionate researchers, developers, and industry experts dedicated to providing high-quality resources and information to the research community. Our platform serves as a hub for knowledge sharing and professional development.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Host events and webinars featuring industry leaders</li>
              <li>Publish cutting-edge research papers and articles</li>
              <li>Provide access to valuable PDF resources and tools</li>
              <li>Connect researchers with industry professionals</li>
              <li>Support academic and industrial projects</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-gray-700 leading-relaxed">
              We invite you to join our growing community of researchers and professionals. Sign up for an account to access all of our resources and participate in upcoming events.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
