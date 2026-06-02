/** @format */

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
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label>Name</Label>
          <Input placeholder='John Doe' />
        </div>

        <div className='space-y-2'>
          <Label>Email</Label>
          <Input type='email' placeholder='email@example.com' />
        </div>

        <div className='space-y-2'>
          <Label>Password</Label>
          <Input type='password' />
        </div>

        <Button className='w-full'>Register</Button>
      </CardContent>
    </Card>
  );
}
