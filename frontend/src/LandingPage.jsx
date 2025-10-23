import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050A15] text-white">
      {/* Hero Section */}
      <header className="py-16 px-6 text-center bg-gradient-to-br from-blue-900/70 via-[#050A15] to-purple-900/60">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-blue-300 drop-shadow">
          Welcome to LingoLive
        </h1>
        <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto mb-8">
          The all-in-one social platform to connect, share, and chat in real-time—where learning meets friendship.
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <Link
            to="/signup"
            className="bg-purple-700 hover:bg-purple-900 transition py-3 px-8 rounded-full text-lg font-semibold"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-blue-800 border border-blue-400 py-3 px-8 rounded-full text-lg font-semibold hover:bg-blue-900 transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-300 mb-8 text-center">Features that Set Us Apart</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-blue-950 rounded-xl p-7 flex flex-col items-center shadow-lg">
            <img src="/image1.png" alt="Real-time Chat" className="mb-5 rounded-lg w-40 h-32 object-cover" />
            <h3 className="text-xl font-semibold text-blue-300 mb-2">Real-Time Communication</h3>
            <p className="text-blue-100">Instant messaging, voice calls, and video calls, powered by WebRTC and Socket.io.</p>
          </div>
          <div className="bg-zinc-300 text-black rounded-xl p-7 flex flex-col items-center shadow-lg">
            <img src="/image2.png" alt="User Management" className="mb-5 rounded-lg w-40 h-32 object-cover" />
            <h3 className="text-xl font-semibold text-black mb-2">Seamless User Management</h3>
            <p className="text-black">Secure registration, profile customization, friend requests, and social connections—all under your control.</p>
          </div>
          <div className="bg-green-600 rounded-xl p-7 flex flex-col items-center shadow-lg">
            <img src="/image3.png" alt="Engagement" className="mb-5 rounded-lg w-40 h-32 object-cover" />
            <h3 className="text-xl font-semibold text-black mb-2">Engage & Share</h3>
            <p className="text-blue-100">Create posts, like, comment, explore the feed, showcase your activities, and celebrate community achievements.</p>
          </div>
          <div className="bg-purple-950 rounded-xl p-7 flex flex-col items-center shadow-lg">
            <img src="/image4.png" alt="Notifications" className="mb-5 rounded-lg w-40 h-32 object-cover" />
            <h3 className="text-xl font-semibold text-purple-300 mb-2">Live Notifications</h3>
            <p className="text-purple-100">Stay updated with instant alerts for every like, comment, friend request, and message.</p>
          </div>
        </div>
      </section>

      {/* How It Works & Demo Section */}
      <section className="py-16 px-6 bg-gradient-to-tr from-[#050A15] via-blue-900/60 to-purple-900/60">
        <h2 className="text-3xl font-bold text-blue-100 mb-8 text-center">How LingoLive Works</h2>
        <div className="flex flex-col md:flex-row items-center gap-10 justify-center">
          <img src="/assets/demo.jpg" alt="Demo Screenshot" className="rounded-2xl w-96 h-64 object-cover shadow-lg border-2 border-purple-400" />
          <ul className="text-lg text-blue-200 space-y-6 max-w-md">
            <li><span className="font-bold text-purple-300">Step 1:</span> Register easily and build your personal profile.</li>
            <li><span className="font-bold text-purple-300">Step 2:</span> Add friends or connect with other users.</li>
            <li><span className="font-bold text-purple-300">Step 3:</span> Share posts, join real-time chats, and explore social interactions.</li>
            <li><span className="font-bold text-purple-300">Step 4:</span> Enjoy seamless communication with notifications, calls, and more.</li>
          </ul>
        </div>
      </section>

      {/* Screenshot/Gallery Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-purple-200 mb-10 text-center">Explore Some Screenshots</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <img src="/Screenshot1.png" alt="Screenshot 1" className="rounded-xl shadow-lg border border-blue-700 w-full h-56 object-cover" />
          <img src="/Screenshot2.png" alt="Screenshot 2" className="rounded-xl shadow-lg border border-purple-600 w-full h-56 object-cover" />
          <img src="/Screenshot3.png" alt="Screenshot 3" className="rounded-xl shadow-lg border border-blue-700 w-full h-56 object-cover" />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-950 via-[#050A15] to-purple-950">
        <h2 className="text-3xl font-bold text-blue-100 mb-8 text-center">What Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-blue-900 rounded-xl p-6 shadow text-blue-200">
            <p className="italic">“The chat and calls are unbelievably fast and stable—perfect for connecting with my friends globally!”</p>
            <span className="block mt-4 font-semibold">— Aarti, Student</span>
          </div>
          <div className="bg-purple-900 rounded-xl p-6 shadow text-purple-200">
            <p className="italic">“I love the instant notifications and easy profile management. LingoLive makes social learning simple.”</p>
            <span className="block mt-4 font-semibold">— Rahul, Developer</span>
          </div>
        </div>
      </section>

      {/* About & Call to Action Section */}
      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-200 mb-4">About LingoLive</h2>
        <p className="text-lg text-blue-100 mb-6">
          LingoLive is a full-featured social media platform designed to blend learning, connection, and fun in a single, seamless experience. Built by Chandermani Mishra, the app is constantly evolving to offer group chat, story sharing, and amazing new features.
        </p>
        <Link
          to="/signup"
          className="bg-purple-700 hover:bg-purple-900 transition py-3 px-10 rounded-full text-lg font-semibold mt-4 inline-block"
        >
          Join Now — Start Your Journey!
        </Link>
      </section>

      <footer className="mt-12 pb-8 text-center text-blue-500 text-sm opacity-75">
        &copy; {new Date().getFullYear()} LingoLive by Chandermani Mishra • All Rights Reserved
      </footer>
    </div>
  );
}
