"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/lib/validations/create-user-schema";
import { z } from "zod";
import { useState } from "react";
import { createUser } from "@/lib/api/users";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type CreateUserFormData = z.infer<typeof createUserSchema>;

export function CreateUserSheet() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      avatar: "",
      password: "",
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      const isoBirthDate =
        data.birthDate && !isNaN(Date.parse(data.birthDate))
          ? new Date(`${data.birthDate}T00:00:00`).toISOString()
          : undefined;

      await createUser({
        ...data,
        birthDate: isoBirthDate,
        role: "MEMBER",
      });

      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setAlert({ type: "success", message: "Usuário criado com sucesso!" });
      reset();
      setTimeout(() => {
        setOpen(false);
        setAlert(null);
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error(error);
      setAlert({ type: "error", message: "Erro ao criar usuário." });
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setAlert(null);
          reset();
        }
      }}
    >
      <SheetTrigger asChild>
        <Button variant="default">Novo Usuário</Button>
      </SheetTrigger>
      <SheetContent className="w-[540px] sm:w-[600px] p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex flex-col justify-between"
        >
          <div>
            <SheetHeader>
              <SheetTitle>Cadastrar Novo Usuário</SheetTitle>
              <SheetDescription>
                Preencha os dados abaixo para adicionar um novo usuário.
              </SheetDescription>
            </SheetHeader>

            {alert && (
              <Alert
                variant={alert.type === "success" ? "default" : "destructive"}
                className="mt-4"
              >
                <AlertTitle>
                  {alert.type === "success" ? "Sucesso" : "Erro"}
                </AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <span className="text-sm text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <span className="text-sm text-red-500">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input id="birthDate" type="date" {...register("birthDate")} />
                {errors.birthDate && (
                  <span className="text-sm text-red-500">
                    {errors.birthDate.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="avatar">URL do Avatar</Label>
                <Input id="avatar" type="url" {...register("avatar")} />
                {errors.avatar && (
                  <span className="text-sm text-red-500">
                    {errors.avatar.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button type="submit" disabled={isSubmitting}>
              Criar
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
