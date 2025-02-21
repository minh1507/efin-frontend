"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1E1E1E] p-6">
      <Card className="w-full max-w-sm rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-200">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-400 font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                required 
                className="mt-2 w-full bg-[#333] text-white border border-[#444] focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all rounded-lg px-4 py-2"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password" className="text-gray-400 font-medium">Password</Label>
              <div className="relative mt-2">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-[#333] text-white border border-[#444] focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all rounded-lg px-4 py-2 pr-10 appearance-none"
                />
                {/* Custom Show/Hide Password Button */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-all shadow-md hover:shadow-blue-500/30">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
