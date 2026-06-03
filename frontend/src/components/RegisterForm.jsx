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

export default function RegisterForm() {
  // 1. form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 2. handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // 3. submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/register", form);

      alert("Registration successful!");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Card className='w-[350px] mx-auto mt-10'>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Name */}
          <div className='space-y-2'>
            <Label>Name</Label>
            <Input
              name='name'
              placeholder='John Doe'
              value={form.name}
              onChange={handleChange}
            />
          </div>

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
            Register
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
