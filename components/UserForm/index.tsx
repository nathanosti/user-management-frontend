
"use client";

import { useUserDetails } from "@/hooks/use-users";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "@/lib/validations/user-form-schema";
import { z } from "zod";
import { useEffect, useState } from "react";
import { updateUser, User } from "@/lib/api/users";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { UserFormFields } from "./components/UserFormFields";
import { UserSuccessAlert } from "./components/UserSuccessAlert";
import { UserAccessDenied } from "./components/UserAccessDenied";

export type UserFormSchema = z.infer<typeof userFormSchema>;

export function UserForm() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const queryClient = useQueryClient();
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

  const getUpdatedFields = <T extends Record<string, any>>(
    oldData: T,
    newData: Partial<T>
  ): Partial<T> => {
    return Object.entries(newData).reduce((acc, [key, value]) => {
      const oldValue = oldData[key as keyof T];
      if (typeof value !== "undefined" && value !== oldValue) {
        acc[key as keyof T] = value;
      }
      return acc;
    }, {} as Partial<T>);
  };

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
      await queryClient.invalidateQueries({ queryKey: ["user", userId] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      router.refresh();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Erro ao atualizar usuário", err);
    }
  };

  if (accessDenied) return <UserAccessDenied />;
  if (isLoading) return <p className="text-center p-6" > Carregando usuário...</p>;
  if (isError || !user) return <p className="text-center p-6 text-red-500" > Erro ao carregar usuário.</p>;

  return (
    <motion.form
      onSubmit= { handleSubmit(onSubmit) }
  initial = {{ opacity: 0, y: 12 }
}
animate = {{ opacity: 1, y: 0 }}
transition = {{ duration: 0.3 }}
    >
  <UserFormFields
        userId={ userId }
watch = { watch }
register = { register }
errors = { errors }
setValue = { setValue }
isSubmitting = { isSubmitting }
showSuccess = { showSuccess }
  />
  </motion.form>
  );
}

