"use client";

import { useUserDetails } from "@/hooks/use-users";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "@/lib/validations/user-form-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { User } from "@/lib/api/users";
import { updateUser } from "@/lib/api/users";

type UserFormSchema = z.infer<typeof userFormSchema>;

function getUpdatedFields<T extends Record<string, any>>(
  oldData: T,
  newData: Partial<T>,
): Partial<T> {
  return Object.entries(newData).reduce((acc, [key, newValue]) => {
    const oldValue = oldData[key as keyof T];

    if (typeof newValue !== "undefined" && newValue !== oldValue) {
      acc[key as keyof T] = newValue;
    }

    return acc;
  }, {} as Partial<T>);
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { data: user, isLoading, isError } = useUserDetails(userId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      avatar: "",
      isActive: true,
      role: "MEMBER",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("birthDate", user.birthDate?.split("T")[0] || "");
      setValue("avatar", user.avatar || "");
      setValue("isActive", user.isActive);
      setValue("role", user.role);
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserFormSchema) => {
    if (!user) return;

    // Converter data para ISO correto
    const isoBirthDate = data.birthDate
      ? new Date(`${data.birthDate}T00:00:00`).toISOString()
      : undefined;

    const formattedData: Partial<User> = {
      ...data,
      birthDate: isoBirthDate,
    };

    const updated = getUpdatedFields(user, formattedData);

    try {
      await updateUser({ id: userId, data: updated });
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (isError || !user) return <p>Erro ao carregar usuário.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Usuário</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={watch("avatar")} />
                <AvatarFallback>{watch("name")?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label>ID</Label>
                <span>{userId}</span>
              </div>
            </div>

            <div>
              <Label>Nome</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label>Telefone</Label>
              <Input type="tel" {...register("phone")} />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label>Data de Nascimento</Label>
              <Input type="date" {...register("birthDate")} />
              {errors.birthDate && (
                <p className="text-red-500 text-sm">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <div>
              <Label>URL do Avatar</Label>
              <Input type="url" {...register("avatar")} />
              {errors.avatar && (
                <p className="text-red-500 text-sm">{errors.avatar.message}</p>
              )}
            </div>

            <div>
              <Label>Cargo (Role)</Label>
              <select
                {...register("role")}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="MEMBER">MEMBER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={watch("isActive")}
                onCheckedChange={(value) => setValue("isActive", value)}
              />
              <Input type="hidden" {...register("isActive")} />
              <Label>Usuário Ativo</Label>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Salvar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
