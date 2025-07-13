'use client';
import Image from 'next/image';
import { Button } from '@mui/material';
import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16">
          <Image
            src="/images/landing-page-pose-01.png" // Replace with your image
            alt="Workout"
            width={600}
            height={400}
            className="rounded-md"
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-red-600 mb-4">BEST FITNESS</h1>
            <p className="text-gray-700 mb-6">
              Our club encourages wellness by providing top-notch equipment, first-class instructors, innovative classes, and qualified staff.
            </p>
            <Button 
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => signIn()}>
                JOIN NOW
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'QUALITY SERVICE' },
            { label: 'SPACIOUS GYM' },
            { label: 'UNIQUE FITNESS PROGRAMS' },
            { label: 'GROUP CLASSES' },
          ].map(({ label }) => (
            <div key={label}>
              <div className="text-xl font-semibold text-red-600 mb-2">{label}</div>
              <p className="text-gray-600 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-red-600 text-sm font-bold mb-2">ONLY 5 DAYS</p>
          <h2 className="text-3xl font-bold mb-4">START YOUR WORKOUT NOW</h2>
          <p className="text-gray-600 mb-6">
            Enter your name and email in the form below to get your first free workout at Profit.
          </p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md"
            />
            <Button className="bg-red-600 text-white w-full hover:bg-red-700">JOIN NOW</Button>
          </form>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">WELCOME TO OUR FITNESS CLUB</h3>
            <p className="text-gray-600">
              Profit is the fitness club that makes fitness totally accessible to everybody. We promise to help people from all walks of life achieve their individual health and fitness goals — no matter their shape, age, and experience.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {/* Replace with real images */}
            <div className="bg-gray-200 aspect-square"></div>
            <div className="bg-gray-300 aspect-square"></div>
            <div className="bg-gray-200 aspect-square"></div>
            <div className="bg-gray-300 aspect-square col-span-2"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
