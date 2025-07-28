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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { User, updateUser } from "@/lib/api/users";
import { Spinner } from "@/components/ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const userId = params.id as string;
  const { data: user, isLoading, isError, error } = useUserDetails(userId);

  const [accessDenied, setAccessDenied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
    const errMessage = (error as any)?.message;
    if (errMessage === "You can only view your own profile") {
      setAccessDenied(true);
      setTimeout(() => router.push("/"), 3000);
    }
  }, [error, router]);

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

      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });

      router.refresh();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-12 h-12 text-primary" />
      </div>
    );

  if (accessDenied) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="max-w-xl mx-auto mt-12 p-4"
        >
          <Alert variant="destructive">
            <AlertTitle>Acesso negado</AlertTitle>
            <AlertDescription>
              Você não tem permissão para visualizar este perfil.
              <br />
              Redirecionando para a listagem...
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => router.push("/")}>
              <ArrowLeftIcon className="mr-2" />
              Voltar para lista
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isError || !user)
    return (
      <p className="text-center text-red-500 mt-10">
        Erro ao carregar usuário.
      </p>
    );

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-2xl mx-auto p-6">
        <Card className="transition-shadow duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Detalhes do Usuário</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {showSuccess && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="success">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                  <AlertTitle>Sucesso!</AlertTitle>
                  <AlertDescription>
                    Dados do usuário atualizados com sucesso.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.div layout className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={watch("avatar")} />
                <AvatarFallback>{watch("name")?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label>ID</Label>
                <span className="block break-all text-sm">{userId}</span>
              </div>
            </motion.div>

            {[
              { label: "Nome", field: "name", type: "text" },
              { label: "Email", field: "email", type: "email" },
              { label: "Telefone", field: "phone", type: "tel" },
              { label: "Data de Nascimento", field: "birthDate", type: "date" },
              { label: "URL do Avatar", field: "avatar", type: "url" },
            ].map(({ label, field, type }) => (
              <motion.div key={field} layout>
                <Label>{label}</Label>
                <Input
                  type={type}
                  {...register(field as keyof UserFormSchema)}
                />
                {errors[field as keyof UserFormSchema] && (
                  <p className="text-red-500 text-sm">
                    {errors[field as keyof UserFormSchema]?.message}
                  </p>
                )}
              </motion.div>
            ))}

            <motion.div layout>
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
            </motion.div>

            <motion.div layout className="flex items-center gap-2">
              <Switch
                checked={watch("isActive")}
                onCheckedChange={(value) => setValue("isActive", value)}
              />
              <Input type="hidden" {...register("isActive")} />
              <Label>Usuário Ativo</Label>
            </motion.div>
          </CardContent>

          <CardFooter className="flex justify-between gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              <ArrowLeftIcon className="mr-2" />
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="transition-transform duration-200 hover:scale-105"
            >
              Salvar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </motion.form>
  );
}
