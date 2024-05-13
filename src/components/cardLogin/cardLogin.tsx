"use client";

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import auth from '@/services/api.service';
import { useState } from 'react';


const CardLogin: React.FC = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    
    const response = await auth(email, password);

        if (response && response.ok) {
            const data = await response.json();
            const token = data.token;

            localStorage.setItem('jwtToken', token);

            router.push("/dashboard")
          } else {
            setErrorMessage("E-mail ou Senha incorretos.");
            console.error('Erro ao fazer login:', response ? response.statusText : 'Erro de rede.');
        }
  };


  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Faça login com seu e-mail e senha.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input 
              name="email" 
              id="email"
              type="email" 
              placeholder="E-mail" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                name="password"
                id="password"
                type="password"
                placeholder="Senha"
              />
            </div>
            {errorMessage && <p className="px-5 text-red-600">{errorMessage}</p>}
            <Button type="submit">Login</Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* Adicione aqui qualquer outro conteúdo desejado no rodapé do cartão */}
      </CardFooter>
    </Card>
  );
};

export default CardLogin;
