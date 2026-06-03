import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginForm() {
  // 1. store form data
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // 2. update form when user types
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // 3. send data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/login", form);

      alert("Login successful!");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Card className='w-[350px] mx-auto mt-10'>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your email and password</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Email */}
          <div className='space-y-2'>
            <Label>Email</Label>
            <Input
              type='email'
              name='email'
              placeholder='email@example.com'
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <Label>Password</Label>
            <Input
              type='password'
              name='password'
              placeholder='********'
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <Button type='submit' className='w-full'>
            Login
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
