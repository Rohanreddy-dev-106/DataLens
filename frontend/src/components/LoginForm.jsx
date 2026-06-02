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

export default function LoginForm() {
  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your email and password</CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label>Email</Label>
          <Input type='email' placeholder='email@example.com' />
        </div>

        <div className='space-y-2'>
          <Label>Password</Label>
          <Input type='password' placeholder='********' />
        </div>

        <Button className='w-full'>Login</Button>
      </CardContent>
    </Card>
  );
}
