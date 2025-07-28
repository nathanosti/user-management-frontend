import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .regex(
      /^(\+55\s?)?(\d{2})\s?\d{4,5}-?\d{4}$/,
      "Telefone deve ser um número brasileiro válido",
    )
    .optional()
    .or(z.literal("")),
  birthDate: z.string().optional(),
  avatar: z.string().url("URL inválida").optional(),
  password: z.string().min(6, "Mínimo 6 caracteres").optional(),
  role: z.enum(["ADMIN", "MEMBER"]),
});
