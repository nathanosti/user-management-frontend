import { z } from "zod";

export const RoleEnum = z.enum(["ADMIN", "MEMBER"]);

export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome muito curto")
    .max(100, "Nome muito longo")
    .optional(),
  email: z.string().email("Email inválido").optional(),
  phone: z
    .string()
    .regex(
      /^(\+55\s?)?(\d{2})\s?\d{4,5}-?\d{4}$/,
      "Telefone deve ser um número válido do Brasil",
    )
    .optional(),
  birthDate: z.string().optional(),
  avatar: z.string().url("URL do avatar inválida").optional(),
  isActive: z.boolean().optional(),
  role: RoleEnum.optional(),
});
