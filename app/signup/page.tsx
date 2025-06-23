/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import { Icon } from "@iconify/react";
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
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
              Commencez votre
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E7B220] to-yellow-300">
                formation d'élite
              </span>
            </h2>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Rejoignez des milliers de commerciaux qui améliorent leurs
              performances grâce à l'entraînement personnalisé d'Underdog Sales,
              experts en formation commerciale.
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
                  Simulations de vente réalistes
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
                  Coaching personnalisé et détaillé
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
                  Méthodes de vendeurs d'élite
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#021945] to-[#E7B220] rounded-xl flex items-center justify-center">
                <img
                  src="https://cdn.prod.website-files.com/67c02b51f44e21ab7d1b30fb/67f40255381e82665f8b0867_ede6cc53-fecb-4508-8516-9a5b3ef248d7-p-500.webp"
                  className="w-4 h-4 object-contain"
                  alt="Underdog Sales Logo"
                />
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Créez votre compte
            </h2>
            <p className="text-gray-600">
              Rejoignez la communauté des vendeurs d'élite
            </p>
          </div>

          {/* Form */}
          <SignupForm />

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                className="font-medium text-[#021945] hover:text-[#E7B220] transition-colors duration-200"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
