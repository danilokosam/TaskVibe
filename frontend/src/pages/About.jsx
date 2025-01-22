import MainLayout from "@/layouts/MainLayout";

const About = () => {
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center">
        About{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
          TaskVibe
        </span>
      </h2>
      <p className="mt-6 text-lg text-gray-200">
        TaskVibe is a task management app designed to boost your productivity.
        Our mission is to help you stay on top of your tasks effortlessly with
        real-time collaboration and user-friendly features.
      </p>
    </section>
  );
};

export default About;
