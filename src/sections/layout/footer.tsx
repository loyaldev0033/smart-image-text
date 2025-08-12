"use client";

import React from "react";
import { Twitter, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { Link } from "@/lib/view-transition";


const footerLinks = [
  {
    title: "Help",
    link: "/"
  },
  {
    title: "Community Guidelines",
    link: "/"
  },
  {
    title: "Terms & Conditions",
    link: "/"
  },
  {
    title: "Privacy Policy",
    link: "/"
  },
  {
    title: "Copyright Compliance Policy",
    link: "/"
  },
  {
    title: "CA Notice at Collection",
    link: "/"
  },
]

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8">
      <div className="container max-w-screen-xl mx-auto px-6">
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {
            footerLinks.map((link, index) => (
              <div key={index}>
                <Link href={link.link} className="text-gray-600 hover:text-primary text-sm hover:underline font-medium">
                  {link.title}
                </Link>
              </div>
            ))
          }
        </div>

        {/* Copyright text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} RedFlag Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
