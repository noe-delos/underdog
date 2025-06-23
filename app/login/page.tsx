/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import { login } from "./actions";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#021945] via-[#021945] to-[#E7B220] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white">
          <div className="max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <img
                src="https://cdn.prod.website-files.com/67c02b51f44e21ab7d1b30fb/67f40255381e82665f8b0867_ede6cc53-fecb-4508-8516-9a5b3ef248d7-p-500.webp"
                className="w-[8rem] h-fit"
                alt="Underdog Sales Logo"
              />
            </div>

            {/* Hero Content */}
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Master
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E7B220] to-yellow-300">
                Cold Calling
              </span>
            </h2>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Practice with ultra-realistic AI agents and perfect your cold
              calling techniques with Underdog Sales, cold calling training
              experts.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="material-symbols:check"
                    className="w-5 h-5 text-green-300"
                  />
                </div>
                <span className="text-white/90">
                  Realistic cold calling simulations
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="material-symbols:check"
                    className="w-5 h-5 text-green-300"
                  />
                </div>
                <span className="text-white/90">
                  Personalized coaching & feedback
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Icon
                    icon="material-symbols:check"
                    className="w-5 h-5 text-green-300"
                  />
                </div>
                <span className="text-white/90">Elite sales methods</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src="https://cdn.prod.website-files.com/67c02b51f44e21ab7d1b30fb/67f40255381e82665f8b0867_ede6cc53-fecb-4508-8516-9a5b3ef248d7-p-500.webp"
                className="w-16 h-4 object-contain"
                alt="Underdog Sales Logo"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to access your cold calling simulations
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon
                      icon="material-symbols:mail"
                      className="h-5 w-5 text-gray-400"
                    />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#021945] focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon
                      icon="material-symbols:lock"
                      className="h-5 w-5 text-gray-400"
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#021945] focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                formAction={login}
                className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#021945] to-[#E7B220] hover:from-[#0A2E4B] hover:to-[#C5A465] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#021945] transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <Icon icon="material-symbols:login" className="w-5 h-5" />
                Sign in
              </button>
            </div>
          </form>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account yet?{" "}
              <Link
                href="/signup"
                className="font-medium text-[#021945] hover:text-[#E7B220] transition-colors duration-200"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="font-medium text-[#021945] hover:text-[#E7B220]"
              >
                terms of service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-[#021945] hover:text-[#E7B220]"
              >
                privacy policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
